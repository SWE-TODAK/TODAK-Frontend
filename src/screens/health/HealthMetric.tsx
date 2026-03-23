// src/screens/HealthMetric.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../api/axios';
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

import type {
  HealthMetricCategory,
  HealthMetricConfig,
  MetricSeriesConfig,
  MetricInputFieldConfig,
} from '../../components/Health/types/healthMetric.types';

import {
  bloodPressureMockRecords,
  bloodSugarMockRecords,
  liverMockRecords,
  kidneyMockRecords,
  lipidMockRecords,
  bodyMockRecords,
} from '../../components/Health/chart-core/healthMetricMockData';

import {
  buildBloodPressureChartSeries,
  buildBloodSugarChartSeries,
  buildLiverChartSeries,
  buildKidneyChartSeries,
  buildLipidChartSeries,
  buildBodyChartSeries,
  buildChartZones,
} from '../../components/Health/chart-core/healthMetricChartData';

import RecentRecordFilter from '../../components/Health/RecentRecordFilter';
import RecordFilterModal from '../../components/Health/RecordFilterModal';
import ResultCard from '../../components/Health/ResultCard';

import { HealthStackParamList } from '../../navigation/HealthStackNavigator';

import { useHealthMetricStore } from '../../store/useHealthMetricStore';

type NavProp = NativeStackNavigationProp<HealthStackParamList, 'HealthMetric'>;
type RouteProps = RouteProp<HealthStackParamList, 'HealthMetric'>;

const DEFAULT_METRIC_ID_MAP: Record<string, string> = {
  bloodPressure: 'm-1',
  body: 'm-2',
  bloodSugar: 'm-3',
  lipid: 'm-4',
  liver: 'm-6',
  kidney: 'm-7',
};

type MetricHistoryItem = {
  metricId: string;
  date: string;
  status?: string;

  // 단일 값 지표
  value?: number;

  // 혈압
  systolic?: number | null;
  diastolic?: number | null;

  // 혈당
  beforeMeal?: number | null;
  afterMeal?: number | null;

  // 콜레스테롤
  totalChol?: number | null;
  triglyceride?: number | null;
  hdl?: number | null;
  ldl?: number | null;
};

type MetricHistoryResponse = {
  metricType?: string;
  history?: MetricHistoryItem[];
};

/**
 * HealthMetricScroller는 x축 라벨만 필요하므로
 * 화면에서는 최소 구조만 따로 맞춰서 넘깁니다.
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

const formatChartDateLabel = (dateText: string) => {
  if (!dateText) return '';

  // 예: "2026-03-22/일" -> "2026-03-22"
  const onlyDate = dateText.split('/')[0];
  const parts = onlyDate.split('-');

  if (parts.length !== 3) return onlyDate;

  const month = parts[1];
  const day = parts[2];

  return `${month}.${day}`;
};


const HealthMetric: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();

  /**
   * 라우트 파라미터
   * - 기본 지표: category 있음
   * - 커스텀 지표: isCustom=true, customMetric 있음
   */
  const { title, category, isCustom = false, customMetric } = route.params;

  /**
   * 기본 지표 category를 타입 안전하게 분리
   * 커스텀 지표일 때는 undefined
   */
  const builtInCategory: HealthMetricCategory | undefined =
    !isCustom && category ? (category as HealthMetricCategory) : undefined;

  /**
   * 기본 지표 config
   */
  const builtInConfig = builtInCategory
    ? HEALTH_METRIC_CONFIG[builtInCategory]
    : undefined;

    

  /**
   * 커스텀 지표용 임시 config
   * - 아직 데이터가 없으므로 기본 축/입력만 세팅
   * - 건강 정보 안내 / 진단 결과는 사용하지 않음
   */
  const customConfig: HealthMetricConfig = {
    category: 'body',
    title,
    chartTitle: `${title} 변화 추이`,
    unit: customMetric?.unit ?? '',
    yAxis: {
      min: 0,
      max: 100,
      ticks: [0, 25, 50, 75, 100],
    },
    series: [
      {
        key: 'custom',
        label: title,
        color: '#2563EB',
        unit: customMetric?.unit ?? '',
      },
    ],
    inputFields: [
      {
        key: 'custom',
        label: title,
        placeholder: '값 입력',
        keyboardType: 'numeric',
        unit: customMetric?.unit ?? '',
        required: true,
      },
    ],
    defaultSelectedSeriesKey: 'custom',
  };

  /**
   * 화면 전체에서 항상 사용할 config
   * => 이제부터는 config 대신 effectiveConfig만 씀
   */
  const effectiveConfig: HealthMetricConfig = isCustom
    ? customConfig
    : (builtInConfig as HealthMetricConfig);

  /**
   * 기본 지표인데 config가 없으면 렌더링 중단
   */
  if (!isCustom && !builtInConfig) {
    return null;
  }

  const metricId = isCustom
  ? customMetric?.id
  : category
  ? DEFAULT_METRIC_ID_MAP[category]
  : undefined;

    const [historyData, setHistoryData] = useState<MetricHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [summaryMessage, setSummaryMessage] = useState('');

    const fetchMetricHistory = async (limit: number) => {
      try {
        if (!metricId) {
          console.log('❌ 추이 조회용 metricId가 없습니다.');
          return;
        }

        setHistoryLoading(true);

        const response = await api.get(`/health/metrics/${metricId}/query`, {
          params: { limit },
        });

        console.log('🟢 summaryMessage:', response.data?.data?.summaryMessage);

        const history: MetricHistoryItem[] = response.data?.data?.history ?? [];
        const summary: string = response.data?.data?.summaryMessage ?? '';

        setHistoryData(history);
        setSummaryMessage(summary);
      } catch (error: any) {
        console.error(
          '❌ 건강 수치 추이 조회 실패:',
          error?.response?.data || error
        );
        setHistoryData([]);
        setSummaryMessage('');
      } finally {
        setHistoryLoading(false);
      }
    };
    
    

  // ------------------------------
  // 최근 기록 필터 상태
  // ------------------------------
  const recordFilter = useHealthMetricStore((state) => state.recordFilter);
  const setRecordFilter = useHealthMetricStore((state) => state.setRecordFilter);

  const filterModalOpen = useHealthMetricStore((state) => state.filterModalOpen);
  const setFilterModalOpen = useHealthMetricStore((state) => state.setFilterModalOpen);

  const customFilterValue = useHealthMetricStore((state) => state.customFilterValue);
  const setCustomFilterValue = useHealthMetricStore((state) => state.setCustomFilterValue);


  useEffect(() => {
    const limit = recordFilter === 'all' ? 30 : Number(recordFilter);

    fetchMetricHistory(limit);
  }, [metricId, recordFilter]);

  // ------------------------------
  // mock 데이터 안전 처리
  // ------------------------------
  const safeBloodPressureRecords = bloodPressureMockRecords ?? [];
  const safeBloodSugarRecords = bloodSugarMockRecords ?? [];
  const safeLiverRecords = liverMockRecords ?? [];
  const safeKidneyRecords = kidneyMockRecords ?? [];
  const safeLipidRecords = lipidMockRecords ?? [];
  const safeBodyRecords = bodyMockRecords ?? [];

  // ------------------------------
  // 화면에 표시할 x축 레코드
  // 커스텀 지표는 현재 데이터가 없으므로 빈 배열
  // ------------------------------
  const displayRecords: DisplayRecord[] = useMemo(() => {
    return historyData.map((record) => ({
      xLabel: formatChartDateLabel(record.date),
    }));
  }, [historyData]);

  // ------------------------------
  // 차트에 넘길 series 데이터
  // 커스텀 지표는 현재 데이터 없으므로 빈 배열
  // ------------------------------
  const chartSeries = useMemo(() => {
    if (historyData.length === 0) return [];

    // 🩸 혈압 (2개)
    if (builtInCategory === 'bloodPressure') {
      return [
        {
          key: 'systolic',
          label: '수축기',
          color: '#2563EB',
          stroke: '#2563EB',
          unit: 'mmHg',
          data: historyData.map((item, index) => ({
            index,
            xLabel: formatChartDateLabel(item.date),
            value: item.systolic ?? 0,
          })),
        },
        {
          key: 'diastolic',
          label: '이완기',
          color: '#60A5FA',
          stroke: '#60A5FA',
          unit: 'mmHg',
          data: historyData.map((item, index) => ({
            index,
            xLabel: formatChartDateLabel(item.date),
            value: item.diastolic ?? 0,
          })),
        },
      ];
    }

    // 🍬 혈당 (2개)
    if (builtInCategory === 'bloodSugar') {
      return [
        {
          key: 'beforeMeal',
          label: '식전',
          color: '#22C55E',
          stroke: '#22C55E',
          unit: 'mg/dL',
          data: historyData.map((item, index) => ({
            index,
            xLabel: formatChartDateLabel(item.date),
            value: item.beforeMeal ?? 0,
          })),
        },
        {
          key: 'afterMeal',
          label: '식후',
          color: '#4ADE80',
          stroke: '#4ADE80',
          unit: 'mg/dL',
          data: historyData.map((item, index) => ({
            index,
            xLabel: formatChartDateLabel(item.date),
            value: item.afterMeal ?? 0,
          })),
        },
      ];
    }

    // 🧬 콜레스테롤 (2개만 선택 → LDL + HDL)
    if (builtInCategory === 'lipid') {
      return [
        {
          key: 'ldl',
          label: 'LDL',
          color: '#EF4444',
          stroke: '#EF4444',
          unit: 'mg/dL',
          data: historyData.map((item, index) => ({
            index,
            xLabel: formatChartDateLabel(item.date),
            value: item.ldl ?? 0,
          })),
        },
        {
          key: 'hdl',
          label: 'HDL',
          color: '#10B981',
          stroke: '#10B981',
          unit: 'mg/dL',
          data: historyData.map((item, index) => ({
            index,
            xLabel: formatChartDateLabel(item.date),
            value: item.hdl ?? 0,
          })),
        },
      ];
    }

    // 🧍‍♀️ 나머지 (1개)
    return [
      {
        key: effectiveConfig.series[0]?.key ?? 'value',
        label: effectiveConfig.series[0]?.label ?? title,
        color: effectiveConfig.series[0]?.color ?? '#2563EB',
        stroke: effectiveConfig.series[0]?.color ?? '#2563EB',
        unit: effectiveConfig.series[0]?.unit ?? effectiveConfig.unit,
        data: historyData.map((item, index) => ({
          index,
          xLabel: formatChartDateLabel(item.date),
          value: item.value ?? 0,
        })),
      },
    ];
  }, [historyData, builtInCategory, effectiveConfig, title]);

  /**
   * 커스텀 지표이거나 데이터가 없을 때 빈 상태 표시용
   */
  const isEmptyData =
    chartSeries.length === 0 || chartSeries.every(s => s.data.length === 0);

  // ------------------------------
  // 정보 모달 상태
  // ------------------------------
  const infoRef = useRef<any>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  /**
   * 정보 버튼 위치 측정 -> info modal anchor
   */
  const openInfo = () => {
    if (isCustom) return;

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
  const [selectedDate, setSelectedDate] = useState(new Date());

  const buildMetricRequestBody = () => {
    const metricId = isCustom
      ? customMetric?.id
      : category
      ? DEFAULT_METRIC_ID_MAP[category]
      : undefined;

    if (!metricId) {
      throw new Error('metricId가 없습니다.');
    }

    const date = selectedDate.toISOString();
    const requestBody: Record<string, any> = { metricId, date };

    if (isCustom) {
      const rawValue = inputValues.custom;

      if (!rawValue || !String(rawValue).trim()) {
        throw new Error('입력값이 비어 있습니다.');
      }

      requestBody.value = Number(rawValue);
      return requestBody;
    }

    switch (builtInCategory) {
      case 'body': {
        const rawValue = inputValues.weight;

        if (!rawValue || !String(rawValue).trim()) {
          throw new Error('체중 입력값이 비어 있습니다.');
        }

        requestBody.value = Number(rawValue);
        return requestBody;
      }

      case 'liver': {
        const rawValue = inputValues.alt;

        if (!rawValue || !String(rawValue).trim()) {
          throw new Error('간 수치 입력값이 비어 있습니다.');
        }

        requestBody.value = Number(rawValue);
        return requestBody;
      }

      case 'kidney': {
        const rawValue = inputValues.creatinine;

        if (!rawValue || !String(rawValue).trim()) {
          throw new Error('신장 수치 입력값이 비어 있습니다.');
        }

        requestBody.value = Number(rawValue);
        return requestBody;
      }

      case 'bloodPressure': {
        const systolic = inputValues.systolic;
        const diastolic = inputValues.diastolic;

        if (!systolic || !diastolic) {
          throw new Error('혈압 입력값이 비어 있습니다.');
        }

        requestBody.systolic = Number(systolic);
        requestBody.diastolic = Number(diastolic);
        return requestBody;
      }

      case 'bloodSugar': {
        const beforeMeal = inputValues.beforeMeal;
        const afterMeal = inputValues.afterMeal;

        if (!beforeMeal || !afterMeal) {
          throw new Error('혈당 입력값이 비어 있습니다.');
        }

        requestBody.beforeMeal = Number(beforeMeal);
        requestBody.afterMeal = Number(afterMeal);
        return requestBody;
      }

      case 'lipid': {
        const totalChol = inputValues.totalChol;
        const triglyceride = inputValues.triglyceride;
        const hdl = inputValues.hdl;
        const ldl = inputValues.ldl;

        if (!totalChol || !triglyceride || !hdl || !ldl) {
          throw new Error('콜레스테롤 입력값이 비어 있습니다.');
        }

        requestBody.totalChol = Number(totalChol);
        requestBody.triglyceride = Number(triglyceride);
        requestBody.hdl = Number(hdl);
        requestBody.ldl = Number(ldl);
        return requestBody;
      }

      default:
        throw new Error('아직 지원하지 않는 지표입니다.');
    }
  };

  const handleSubmitMetricValue = async () => {
    try {
      const requestBody = buildMetricRequestBody();

      console.log('✅ 건강 수치 저장 요청:', requestBody);

      const response = await api.post('/health/metrics/batch', requestBody);

      console.log('✅ 건강 수치 저장 응답:', response.data);

      const limit = recordFilter === 'all' ? 30 : Number(recordFilter);
      await fetchMetricHistory(limit);

      setInputValues({});
      setSelectedDate(new Date());
      setInputOpen(false);
    } catch (error: any) {
      console.error(
        '❌ 건강 수치 저장 실패:',
        error?.response?.data || error?.message || error
      );
    }
  };

  /**
   * 입력값은 지표마다 field 개수가 다르므로
   * Record<string, string> 형태로 관리
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
  // ------------------------------
  const selectedSeriesKey = useHealthMetricStore((state) => state.selectedSeriesKey);
  const setSelectedSeriesKey = useHealthMetricStore((state) => state.setSelectedSeriesKey);

  // ------------------------------
  // 툴팁 상태
  // ------------------------------
  const tooltip = useHealthMetricStore((state) => state.tooltip);
  const setTooltip = useHealthMetricStore((state) => state.setTooltip);

  /**
   * 현재 툴팁이 가리키는 series 설정
   */
  const tooltipSeries = useMemo(() => {
    if (!tooltip) return null;

    return (
      effectiveConfig.series.find(
        (series: MetricSeriesConfig) => series.key === tooltip.key
      ) ?? null
    );
  }, [effectiveConfig, tooltip]);

  type SelectedDetailState = {
    metricValueId?: string;
    date: string;

    value?: number;

    systolic?: number | null;
    diastolic?: number | null;

    beforeMeal?: number | null;
    afterMeal?: number | null;

    totalChol?: number | null;
    triglyceride?: number | null;
    hdl?: number | null;
    ldl?: number | null;
  };

  const [selectedDetail, setSelectedDetail] = useState<SelectedDetailState | null>(null);


  /**
   * config가 바뀌면 선택 series와 tooltip 초기화
   */
  useEffect(() => {
    setSelectedSeriesKey(
      effectiveConfig.defaultSelectedSeriesKey ?? effectiveConfig.series[0]?.key ?? ''
    );
    setTooltip(null);
  }, [effectiveConfig, setSelectedSeriesKey, setTooltip]);
  /**
   * 현재 선택된 series
   */
  const selectedSeries = useMemo(() => {
    return (
      effectiveConfig.series.find(
        (series: MetricSeriesConfig) => series.key === selectedSeriesKey
      ) ?? effectiveConfig.series[0]
    );
  }, [effectiveConfig, selectedSeriesKey]);

  /**
   * 선택된 series의 zone을 차트용 구조로 변환
   */
  const chartZones = useMemo(() => {
    return buildChartZones(selectedSeries?.zones);
  }, [selectedSeries]);

  

  // ------------------------------
  // 기본 지표용 임시 진단 결과
  // 커스텀 지표는 사용 안 함
  // ------------------------------
  const resultData = useMemo(() => {
  if (historyLoading) {
    return {
      title: '진단 결과',
      lines: ['분석 중입니다...'],
    };
  }

  if (!summaryMessage) {
    return {
      title: '진단 결과',
      lines: ['진단 결과가 아직 없습니다.'],
    };
  }

  return {
    title: '진단 결과',
    lines: [summaryMessage],
  };
}, [summaryMessage, historyLoading]);

  const openFilterModal = useHealthMetricStore((state) => state.openFilterModal);
  const syncCustomFilterValue = useHealthMetricStore((state) => state.syncCustomFilterValue);

  const formatDetailDate = (dateText: string) => {
    if (!dateText) return '';

    const [datePart, dayPartRaw] = dateText.split('/');
    const dayPart = dayPartRaw ?? '';

    const parts = datePart.split('-');
    if (parts.length !== 3) return dateText;

    const [year, month, day] = parts;
    return `${year}.${month}.${day}/${dayPart}`;
  };

  const handleDeleteMetricValue = async () => {
    try {
      const metricValueId = selectedDetail?.metricValueId;

      if (!metricValueId) {
        console.log('❌ 아직 metricValueId가 없어서 삭제 API를 호출할 수 없습니다.');
        return;
      }

      const response = await api.delete(`/health/metrics/values/${metricValueId}`);

      console.log('✅ 수치 삭제 응답:', response.data);

      const limit = recordFilter === 'all' ? 30 : Number(recordFilter);
      await fetchMetricHistory(limit);

      setSelectedDetail(null);
    } catch (error: any) {
      console.error(
        '❌ 수치 삭제 실패:',
        error?.response?.data || error
      );
    }
  };

  return (
    <View style={styles.root}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={{ width: 32 }} />
      </View>

      <View style={styles.headerShadow} />

      {/* 최근 기록 보기 필터 */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>최근 기록 보기</Text>

        <View style={styles.filterRow}>
          <View style={styles.filterBox}>
            <RecentRecordFilter />
          </View>

          <TouchableOpacity
            style={[
              styles.filterIconButton,
              filterModalOpen && styles.filterIconButtonActive,
            ]}
            onPress={() => {
              syncCustomFilterValue();
              openFilterModal();
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

          <RecordFilterModal/>
        </View>
      </View>

      {/* 본문 */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <MetricChartCard
          category={builtInCategory ?? 'body'}
          onPressInfo={openInfo}
          onPressAdd={() => {
            setInputValues(
              effectiveConfig.inputFields.reduce(
                (acc: Record<string, string>, field: MetricInputFieldConfig) => {
                  acc[field.key] = '';
                  return acc;
                },
                {} as Record<string, string>
              )
            );
            setInputOpen(true);
          }}
          style={styles.cardMargin}
          infoRef={infoRef}
        >
          {isEmptyData ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>아직 기록이 없어요</Text>
              <Text style={styles.emptySubText}>
                + 버튼을 눌러 첫 데이터를 추가해보세요
              </Text>
            </View>
          ) : (
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
                  yMin={effectiveConfig.yAxis.min}
                  yMax={effectiveConfig.yAxis.max}
                  yTicks={effectiveConfig.yAxis.ticks}
                  zones={chartZones}
                  selectedKey={selectedSeriesKey}
                  selectedPoint={tooltip ? { key: tooltip.key, index: tooltip.index } : null}
                  onSelectSeries={(key) => {
                    if (effectiveConfig.series.length <= 1) return;
                    setSelectedSeriesKey(key);
                  }}
                  onSelectPoint={(point) => {
                    const selected = historyData[point.index];
                    if (!selected) return;

                    setSelectedDetail((prev) => {
                      const sameDate = prev?.date === selected.date;

                      if (sameDate) {
                        return null;
                      }

                      return {
                        metricValueId: selected.metricId,
                        date: selected.date,

                        value: selected.value,

                        systolic: selected.systolic,
                        diastolic: selected.diastolic,

                        beforeMeal: selected.beforeMeal,
                        afterMeal: selected.afterMeal,

                        totalChol: selected.totalChol,
                        triglyceride: selected.triglyceride,
                        hdl: selected.hdl,
                        ldl: selected.ldl,
                      };
                    });

                    setTooltip(null);
                  }}
                  series={chartSeries}
                />
              )}
              renderYAxis={(h) => (
                <ChartYAxis
                  height={h}
                  yMin={effectiveConfig.yAxis.min}
                  yMax={effectiveConfig.yAxis.max}
                  ticks={effectiveConfig.yAxis.ticks}
                />
              )}
            />
          )}
        </MetricChartCard>

        {selectedDetail && (
          <View style={styles.detailCard}>
            <Text style={styles.detailDate}>
              {formatDetailDate(selectedDetail.date)}
            </Text>

            {builtInCategory === 'bloodPressure' ? (
              <>
                <Text style={styles.detailValue}>
                  수축기 {selectedDetail.systolic ?? '-'}mmHg
                </Text>
                <Text style={styles.detailValue}>
                  이완기 {selectedDetail.diastolic ?? '-'}mmHg
                </Text>
              </>
            ) : builtInCategory === 'bloodSugar' ? (
              <>
                <Text style={styles.detailValue}>
                  식전 {selectedDetail.beforeMeal ?? '-'}mg/dL
                </Text>
                <Text style={styles.detailValue}>
                  식후 {selectedDetail.afterMeal ?? '-'}mg/dL
                </Text>
              </>
            ) : builtInCategory === 'lipid' ? (
              <>
                <Text style={styles.detailValue}>
                  총콜레스테롤 {selectedDetail.totalChol ?? '-'}mg/dL
                </Text>
                <Text style={styles.detailValue}>
                  중성지방 {selectedDetail.triglyceride ?? '-'}mg/dL
                </Text>
                <Text style={styles.detailValue}>
                  HDL {selectedDetail.hdl ?? '-'}mg/dL
                </Text>
                <Text style={styles.detailValue}>
                  LDL {selectedDetail.ldl ?? '-'}mg/dL
                </Text>
              </>
            ) : (
              <Text style={styles.detailValue}>
                {title} {selectedDetail.value ?? '-'}{effectiveConfig.unit}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.detailTrashButton,
                !selectedDetail.metricValueId && styles.detailTrashButtonDisabled,
              ]}
              onPress={handleDeleteMetricValue}
              disabled={!selectedDetail.metricValueId}
            >
              <Image
                source={require('../../assets/icons/trash.png')}
                style={[
                  styles.detailTrashIcon,
                  !selectedDetail.metricValueId && styles.detailTrashIconDisabled,
                ]}
              />
            </TouchableOpacity>
          </View>
        )}

                {/* 기본 지표만 진단 결과 표시 */}
                {!isCustom && <ResultCard title={resultData.title} lines={resultData.lines} />}
              </ScrollView>

      {/* 포인트 툴팁 */}
     

      {/* 입력 모달 */}
      <MetricInputModal
        visible={inputOpen}
        onClose={() => setInputOpen(false)}
        title={title}
        inputFields={effectiveConfig.inputFields}
        values={inputValues}
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
        onChangeValue={handleChangeInputValue}
        onSubmit={handleSubmitMetricValue}
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
  emptyContainer: {
    height: 360,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubText: {
    marginTop: 6,
    fontSize: 13,
    color: '#9CA3AF',
  },
  detailCard: {
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#22C55E',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  detailDate: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  detailValue: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#22C55E',
  },
  detailTrashButton: {
    position: 'absolute',
    right: 14,
    bottom: 12,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTrashButtonDisabled: {
    opacity: 0.4,
  },
  detailTrashIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#9CA3AF',
  },
  detailTrashIconDisabled: {
    tintColor: '#D1D5DB',
  },
});