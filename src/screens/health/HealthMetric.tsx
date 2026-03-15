// src/screens/HealthMetric.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  UIManager,
  findNodeHandle,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import HealthMetricScroller from '../../components/Health/chart-core/HealthMetricScroller';
import LineMetricChart from '../../components/Health/charts/LineMetricChart';
import ChartYAxis from '../../components/Health/charts/ChartYAxis';
import MetricChartCard from '../../components/Health/chart-ui/MetricChartCard';
import MetricInfoModal from '../../components/Health/chart-ui/MetricInfoModal';
import MetricInputModal from '../../components/Health/chart-ui/MetricInputModal';
import { HEALTH_METRIC_CONFIG } from '../../components/Health/healthMetricConfig';

import {
  bloodPressureMockRecords,
  bloodSugarMockRecords,
} from '../../components/Health/chart-core/healthMetricMockData.ts';

import {
  buildBloodPressureChartSeries,
  buildBloodSugarChartSeries,
  buildChartZones,
} from '../../components/Health/chart-core/healthMetricChartData';

import RecentRecordFilter from '../../components/Health/RecentRecordFilter';
import RecordFilterModal from '../../components/Health/RecordFilterModal';
import ResultCard from '../../components/Health/ResultCard';

import { HealthStackParamList } from '../../navigation/HealthStackNavigator';

type NavProp = NativeStackNavigationProp<HealthStackParamList, 'HealthMetric'>;
type RouteProps = RouteProp<HealthStackParamList, 'HealthMetric'>;

/**
 * 스크롤러에는 x축 라벨만 넘기면 되므로
 * 화면에서는 최소 구조만 따로 맞춰서 사용합니다.
 */
type DisplayRecord = {
  xLabel: string;
};

type Anchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const HealthMetric: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();

  /**
   * 라우트 파라미터
   * - title: 헤더 제목
   * - category: 지표 구분 키
   */
  const { title, category } = route.params;

  /**
   * 현재 카테고리에 맞는 지표 설정
   * 설정이 없으면 렌더링하지 않음
   */
  const config = HEALTH_METRIC_CONFIG[category];
  if (!config) {
    return null;
  }

  // ------------------------------
  // 최근 기록 필터 상태
  // ------------------------------
  const [recordFilter, setRecordFilter] = useState<number | 'all'>(7);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [customFilterValue, setCustomFilterValue] = useState(
    String(recordFilter === 'all' ? 7 : recordFilter)
  );

  // ------------------------------
  // 화면에 표시할 x축 레코드
  // Scroller는 xLabel만 사용하므로 최소 구조로 맞춤
  // ------------------------------
  const safeBloodPressureRecords = bloodPressureMockRecords ?? [];
  const safeBloodSugarRecords = bloodSugarMockRecords ?? [];
  const displayRecords: DisplayRecord[] = useMemo(() => {
    switch (category) {
      case 'bloodPressure': {
        const records =
          recordFilter === 'all'
            ? safeBloodPressureRecords
            : safeBloodPressureRecords.slice(-recordFilter);

        return records.map(record => ({
          xLabel: record.xLabel,
        }));
      }

      case 'bloodSugar': {
        const records =
          recordFilter === 'all'
            ? safeBloodSugarRecords
            : safeBloodSugarRecords.slice(-recordFilter);

        return records.map(record => ({
          xLabel: record.xLabel,
        }));
      }

      default:
        return [];
    }
  }, [category, recordFilter, safeBloodPressureRecords, safeBloodSugarRecords]);

  // ------------------------------
  // 차트에 넘길 series 데이터
  // 현재는 더미 데이터 기반, 나중에 API 데이터로 교체 가능
  // ------------------------------
  const chartSeries = useMemo(() => {
    switch (category) {
      case 'bloodPressure': {
        const records =
          recordFilter === 'all'
            ? safeBloodPressureRecords
            : safeBloodPressureRecords.slice(-recordFilter);

        return buildBloodPressureChartSeries(records, config.series);
      }

      case 'bloodSugar': {
        const records =
          recordFilter === 'all'
            ? safeBloodSugarRecords
            : safeBloodSugarRecords.slice(-recordFilter);

        return buildBloodSugarChartSeries(records, config.series);
      }

      default:
        return [];
    }
  }, [
    category,
    recordFilter,
    config.series,
    safeBloodPressureRecords,
    safeBloodSugarRecords,
  ]);

  // ------------------------------
  // 정보 모달 상태
  // ------------------------------
  const infoRef = useRef<any>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  /**
   * 정보 버튼 위치를 측정해서 모달 anchor로 사용
   */
  const openInfo = () => {
    const node = findNodeHandle(infoRef.current);

    if (!node) {
      setInfoOpen(true);
      return;
    }

    UIManager.measureInWindow(node, (x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setInfoOpen(true);
    });
  };

  // ------------------------------
  // 입력 모달 상태
  // ------------------------------
  const [inputOpen, setInputOpen] = useState(false);

  /**
   * 입력값은 지표마다 필드 개수가 다를 수 있으므로
   * 공통 Record<string, string> 구조로 관리
   *
   * 예시
   * - 혈압: { sys: '120', dia: '80' }
   * - 혈당: { glucose: '95' }
   */
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const handleChangeInputValue = (key: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // ------------------------------
  // 선택된 series 상태
  // 혈압: sys / dia
  // 혈당: glucose
  // ------------------------------
  const [selectedSeriesKey, setSelectedSeriesKey] = useState<string>(
    config.defaultSelectedSeriesKey ?? config.series[0]?.key ?? ''
  );

  /**
   * category 변경 시 기본 series를 다시 세팅하고
   * 기존 tooltip은 닫음
   */
  useEffect(() => {
    setSelectedSeriesKey(config.defaultSelectedSeriesKey ?? config.series[0]?.key ?? '');
    setTooltip(null);
  }, [config]);

  /**
   * 현재 선택된 series 설정
   */
  const selectedSeries = useMemo(() => {
    return config.series.find(series => series.key === selectedSeriesKey) ?? config.series[0];
  }, [config, selectedSeriesKey]);

  /**
   * 선택된 series의 정상 범위를 차트 zone 구조로 변환
   */
  const chartZones = useMemo(() => {
    return buildChartZones(selectedSeries?.zones);
  }, [selectedSeries]);

  // ------------------------------
  // 툴팁 상태
  // ------------------------------
  const [tooltip, setTooltip] = useState<{
    key: string;
    index: number;
    x: number;
    y: number;
    xLabel: string;
    value: number;
  } | null>(null);

  /**
   * 현재 툴팁이 가리키는 series 설정
   * 라벨 / 색상 / 단위 표시용
   */
  const tooltipSeries = useMemo(() => {
    if (!tooltip) return null;
    return config.series.find(series => series.key === tooltip.key) ?? null;
  }, [config, tooltip]);

  // ------------------------------
  // 진단 결과 카드
  // TODO: 나중에 백엔드 응답으로 교체
  // 지금은 임시 더미 데이터
  // ------------------------------
  const resultData = useMemo(() => {
    switch (category) {
      case 'bloodPressure':
        return {
          title: '혈압 진단 결과',
          lines: [
            '최근 3회 측정 모두 정상 범위입니다.',
            '수축기 평균 121mmHg, 이완기 평균 79mmHg로 안정적인 상태예요.',
            '지금처럼 규칙적인 식습관과 가벼운 운동을 유지하세요 💚',
          ],
        };

      case 'bloodSugar':
        return {
          title: '혈당 진단 결과',
          lines: [
            '최근 기록 기준으로 혈당 흐름이 비교적 안정적입니다.',
            '식사 여부와 측정 시점에 따라 수치 해석이 달라질 수 있어요.',
            '정확한 진단 결과는 백엔드 응답으로 연결될 예정입니다.',
          ],
        };

      default:
        return {
          title: '진단 결과',
          lines: ['진단 결과 데이터가 아직 준비되지 않았습니다.'],
        };
    }
  }, [category]);

  return (
    <View style={styles.root}>
      {/* ------------------------------
          헤더
      ------------------------------ */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={{ width: 32 }} />
      </View>

      <View style={styles.headerShadow} />

      {/* ------------------------------
          최근 기록 보기 필터 영역
      ------------------------------ */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>최근 기록 보기</Text>

        <View style={styles.filterRow}>
          <View style={styles.filterBox}>
            <RecentRecordFilter
              value={recordFilter}
              onChange={(value) => {
                setRecordFilter(value);
                setTooltip(null);
              }}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.filterIconButton,
              filterModalOpen && styles.filterIconButtonActive,
            ]}
            onPress={() => {
              setCustomFilterValue(String(recordFilter === 'all' ? 7 : recordFilter));
              setFilterModalOpen(true);
            }}
          >
            <Image
              source={
                filterModalOpen
                  ? require('../../assets/icons/blue-filter.png')
                  : require('../../assets/icons/filter.png')
              }
              style={styles.filterIcon}
            />
          </TouchableOpacity>

          <RecordFilterModal
            visible={filterModalOpen}
            value={customFilterValue}
            onChangeValue={setCustomFilterValue}
            onClose={() => setFilterModalOpen(false)}
            onConfirm={() => {
              const n = Number(customFilterValue);

              if (!Number.isNaN(n) && n > 0) {
                setRecordFilter(n as 7 | 14 | 21 | 'all');
              }

              setFilterModalOpen(false);
            }}
          />
        </View>
      </View>

      {/* ------------------------------
          본문
      ------------------------------ */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 차트 카드 */}
        <MetricChartCard
          category={category}
          onPressInfo={openInfo}
          onPressAdd={() => {
            // 현재 지표 설정에 맞는 입력 필드만 초기화
            setInputValues(
              config.inputFields.reduce((acc, field) => {
                acc[field.key] = '';
                return acc;
              }, {} as Record<string, string>)
            );
            setInputOpen(true);
          }}
          style={styles.cardMargin}
          infoRef={infoRef}
        >
          <HealthMetricScroller
            records={displayRecords}
            pointGap={44}
            height={360}
            yAxisWidth={45}
            renderChart={(_, chartWidth, h) => (
              <LineMetricChart
                width={chartWidth}
                height={h}
                reverseX
                yMin={config.yAxis.min}
                yMax={config.yAxis.max}
                yTicks={config.yAxis.ticks}
                zones={chartZones}
                selectedKey={selectedSeriesKey}
                selectedPoint={tooltip ? { key: tooltip.key, index: tooltip.index } : null}
                onSelectSeries={(key) => {
                  // series가 1개뿐인 지표는 선택 변경 불필요
                  if (config.series.length <= 1) return;
                  setSelectedSeriesKey(key);
                }}
                onSelectPoint={(point) => {
                  setTooltip(prev => {
                    if (prev && prev.index === point.index && prev.key === point.key) {
                      return null;
                    }
                    return point;
                  });
                }}
                series={chartSeries}
              />
            )}
            renderYAxis={(h) => (
              <ChartYAxis
                height={h}
                yMin={config.yAxis.min}
                yMax={config.yAxis.max}
                ticks={config.yAxis.ticks}
              />
            )}
          />
        </MetricChartCard>

        {/* 진단 결과 카드
            TODO: 백엔드 응답 연결 예정 */}
        <ResultCard title={resultData.title} lines={resultData.lines} />
      </ScrollView>

      {/* ------------------------------
          포인트 툴팁
      ------------------------------ */}
      {tooltip && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setTooltip(null)}
          style={{
            position: 'absolute',
            top: tooltip.y + 250,
            left: tooltip.x,
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: tooltipSeries?.color ?? '#3B82F6',
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
            {tooltip.xLabel}
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 16,
              fontWeight: '700',
              color: tooltipSeries?.color ?? '#111827',
            }}
          >
            {(tooltipSeries?.label ?? tooltip.key)} {tooltip.value}
            {tooltipSeries?.unit ?? config.unit ?? ''}
          </Text>
        </TouchableOpacity>
      )}

      {/* ------------------------------
          건강 정보 모달
          config.infoModal 기반
      ------------------------------ */}
      <MetricInfoModal
        visible={infoOpen}
        onClose={() => setInfoOpen(false)}
        title={config.infoModal?.title ?? ''}
        bullets={config.infoModal?.bullets ?? []}
        note={config.infoModal?.note}
        anchor={anchor}
      />

      {/* ------------------------------
          입력 모달
          config.inputFields 기반
      ------------------------------ */}
      <MetricInputModal
        visible={inputOpen}
        onClose={() => setInputOpen(false)}
        title={title}
        inputFields={config.inputFields}
        values={inputValues}
        onChangeValue={handleChangeInputValue}
        onSubmit={() => {
          console.log('submit', inputValues);
          setInputOpen(false);
        }}
      />
    </View>
  );
};

export default HealthMetric;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerShadow: {
    height: 0.5,
    backgroundColor: '#CCD1DA',
    elevation: 4,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: 5,
    paddingBottom: 32,
  },
  cardMargin: {
    marginHorizontal: 20,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    marginTop: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBox: {
    flex: 1,
  },
  filterIconButton: {
    marginLeft: 8,
    width: 45,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  filterIconButtonActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
});

