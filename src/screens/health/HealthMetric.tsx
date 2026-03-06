// src/screens/HealthMetric.tsx
import React, { useMemo, useState, useRef ,useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, UIManager, findNodeHandle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import HealthMetricScroller from '../../components/Health/chart-core/HealthMetricScroller';
import LineMetricChart from '../../components/Health/charts/LineMetricChart';
import ChartYAxis from '../../components/Health/charts/ChartYAxis';
import MetricChartCard from '../../components/Health/chart-ui/MetricChartCard';
import MetricInfoModal from '../../components/Health/chart-ui/MetricInfoModal';
import { METRIC_INFO } from '../../components/Health/metricInfoMap';
import MetricInputModal from '../../components/Health/chart-ui/MetricInputModal';

import RecentRecordFilter from '../../components/Health/RecentRecordFilter';
import RecordFilterModal from '../../components/Health/RecordFilterModal';

import { HealthStackParamList } from '../../navigation/HealthStackNavigator';

type NavProp = NativeStackNavigationProp<HealthStackParamList, 'HealthMetric'>;
type RouteProps = RouteProp<HealthStackParamList, 'HealthMetric'>;

type BloodPressureRecord = {
  xLabel: string;
  systolic: number; // 수축기
  diastolic: number; // 이완기
};

type Anchor = { x: number; y: number; width: number; height: number };

// ✅ 더미 데이터(나중에 API 데이터로 교체)
const records: BloodPressureRecord[] = Array.from({ length: 10 }).map((_, i) => ({
  xLabel: String(i + 1),
  systolic: 115 + Math.round(Math.random() * 25),
  diastolic: 75 + Math.round(Math.random() * 15),
}));



const HealthMetric: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();

  //최근기록보기
  const [recordFilter, setRecordFilter] = useState<number | 'all'>(7);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [customFilterValue, setCustomFilterValue] = useState(String(recordFilter === 'all' ? 7 : recordFilter));
  const filteredRecords = useMemo(() => {
  if (recordFilter === 'all') return records;
  return records.slice(-recordFilter);
}, [recordFilter]);

  // ✅ route에서 category까지 받기
  const { title, category } = route.params;
  const infoRef = useRef<any>(null);
  const [infoOpen, setInfoOpen] = useState(false);
   const [anchor, setAnchor] = useState<{
    x: number; y: number; width: number; height: number;
  } | null>(null); 

  const info = useMemo(() => METRIC_INFO[category], [category]);

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

  const handlePressInfo = () => {
    console.log('INFO PRESSED');

    // ✅ 3) 버튼 위치 측정 -> anchor 세팅 -> open
    infoRef.current?.measureInWindow?.((x: number, y: number, width: number, height: number) => {
      setAnchor({ x, y, width, height });
      setInfoOpen(true);
    });
  };

  const [inputOpen, setInputOpen] = useState(false);

  
    
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [selectedSeriesKey, setSelectedSeriesKey] = useState<string>('sys');
  const chartZones =
  selectedSeriesKey === 'dia'
    ? [
        { from: 60, to: 80, fill: '#A7F3C0', opacity: 0.85 },
        { from: 80, to: 90, fill: '#FDE68A', opacity: 0.75 },
        { from: 90, to: 100, fill: '#FCA5A5', opacity: 0.65 },
      ]
    : [
        { from: 90, to: 120, fill: '#A7F3C0', opacity: 0.85 },
        { from: 120, to: 140, fill: '#FDE68A', opacity: 0.75 },
        { from: 140, to: 150, fill: '#FCA5A5', opacity: 0.65 },
      ];
  const [tooltip, setTooltip] = useState<{
    key: string;
    index: number;
    x: number;
    y: number;
    xLabel: string;
    value: number;
  } | null>(null);
    

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

      {/* 헤더 아래 라인 */}
      <View style={styles.headerShadow} />
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>최근 기록 보기</Text>

        <View style={styles.filterRow}>
          <View style={styles.filterBox}>
            <RecentRecordFilter
              value={recordFilter}
              onChange={(value) => {
                setRecordFilter(value);
                setTooltip(null); // 필터 바뀌면 툴팁 닫기
              }}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.filterIconButton,
              filterModalOpen && styles.filterIconButtonActive,
            ]}
            onPress={() => {
              console.log('FILTER PRESSED');
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
                setRecordFilter(n as 7 | 14 | 21 | 'all'); // 일단 임시
              }

              setFilterModalOpen(false);
            }}
          />
        </View>
      </View>

      {/* 바디 */}
      <View style={styles.body}>
        <MetricChartCard
          title="수축·이완(mmHg)"
          onPressInfo={openInfo}
          onPressAdd={() => {
            console.log('ADD PRESSED');
            setSys('');
            setDia('');
            setInputOpen(true);
          }}
          style={styles.cardMargin}
          infoRef={infoRef}
        >
          <HealthMetricScroller
            records={filteredRecords}
            pointGap={44}
            height={360}
            yAxisWidth={45}
            renderChart={(slice, chartWidth, h) => (
              <LineMetricChart
                width={chartWidth}
                height={h}
                reverseX
                yMin={30}
                yMax={150}
                yTicks={[30, 60, 90, 120, 150]}
                zones={chartZones}
                selectedKey={selectedSeriesKey}
                selectedPoint={tooltip ? { key: tooltip.key, index: tooltip.index } : null}
                onSelectSeries={(key) => {
                  console.log('selected series:', key);
                  setSelectedSeriesKey(key);
                }}
                onSelectPoint={(point) => {
                  console.log('selected point:', point);

                  setTooltip((prev) => {
                    if (
                      prev &&
                      prev.index === point.index &&
                      prev.key === point.key
                    ) {
                      return null; // 같은 점이면 닫기
                    }
                    return point;
                  });
                }}
                series={[
                  {
                    key: 'sys',
                    stroke: '#1D4ED8',
                    data: slice.map((d) => ({ xLabel: d.xLabel, value: d.systolic })),
                  },
                  {
                    key: 'dia',
                    stroke: '#9CA3AF',
                    data: slice.map((d) => ({ xLabel: d.xLabel, value: d.diastolic })),
                  },
                ]}
              />
            )}
            renderYAxis={(h) => (
              <ChartYAxis height={h} yMin={30} yMax={150} ticks={[30, 60, 90, 120, 150]} />
            )}
          />
        </MetricChartCard>

      </View>
      {tooltip && (
         <TouchableOpacity
            activeOpacity={1}
            onPress={() => setTooltip(null)}
          style={{
            position: 'absolute',
            top: tooltip.y + 250,
            left: tooltip.x ,
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: '#3B82F6',
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
              color: tooltip.key === 'sys' ? '#2563EB' : '#EAB308',
            }}
          >
            {tooltip.key === 'sys' ? '수축' : '이완'} {tooltip.value}mmHg
          </Text>
        </TouchableOpacity>
      )}
      <MetricInfoModal
        visible={infoOpen}
        onClose={() => setInfoOpen(false)}
        title={info?.title ?? ''}
        bullets={info?.bullets ?? []}
        note={info?.note}
        anchor={anchor}
      />

      <MetricInputModal
        visible={inputOpen}
        onClose={() => setInputOpen(false)}
        title={title} // 또는 "혈압·심혈관"
        systolic={sys}
        diastolic={dia}
        onChangeSystolic={setSys}
        onChangeDiastolic={setDia}
        onSubmit={() => {
          console.log('submit', { sys, dia });
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
    paddingTop: 5,
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
    marginTop:12,
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