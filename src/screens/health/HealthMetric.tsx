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
    useEffect(() => {
    console.log('inputOpen:', inputOpen);
  }, [inputOpen]);
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');

    

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
            records={records}
            pointGap={44}
            height={360}
            yAxisWidth={43}
            renderChart={(slice, chartWidth, h) => (
              <LineMetricChart
                width={chartWidth}
                height={h}
                reverseX
                yMin={30}
                yMax={150}
                yTicks={[30, 60, 90, 120, 150]}
                zones={[
                  { from: 90, to: 120, fill: '#A7F3C0', opacity: 0.85 },
                  { from: 120, to: 140, fill: '#FDE68A', opacity: 0.75 },
                  { from: 140, to: 150, fill: '#FCA5A5', opacity: 0.65 },
                ]}
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
    paddingTop: 16,
  },
  cardMargin: {
    marginHorizontal: 20,
  },
});