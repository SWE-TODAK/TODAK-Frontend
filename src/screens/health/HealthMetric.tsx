// src/screens/HealthMetric.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HealthMetricScroller from '../../components/Health/chart-core/HealthMetricScroller.tsx';
import LineMetricChart from '../../components/Health/charts/LineMetricChart.tsx';
import BloodPressureYAxis from '../../components/Health/charts/ChartYAxis.tsx';
import MetricChartCard from '../../components/Health/chart-ui/MetricChartCard.tsx';
import { HealthStackParamList } from '../../navigation/HealthStackNavigator'; // ✅ 여기서 가져오기

export type HealthMetricCategory =
  | 'kidney'
  | 'lipid'
  | 'body'
  | 'bloodPressure'
  | 'liver'
  | 'bloodSugar';



type RecordPoint = { xLabel: string; systolic: number; diastolic: number };

// ✅ 더미 데이터(나중에 API 데이터로 교체)
const records: RecordPoint[] = Array.from({ length: 10 }).map((_, i) => ({
  xLabel: String(i + 1),
  systolic: 115 + Math.round(Math.random() * 25),
  diastolic: 75 + Math.round(Math.random() * 15),
}));

type NavProp = NativeStackNavigationProp<HealthStackParamList, 'HealthMetric'>;
type RouteProps = RouteProp<HealthStackParamList, 'HealthMetric'>;

const HealthMetric: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();

  const { title } = route.params;


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

      {/* 헤더 아래 라인/그림자 */}
      <View style={styles.headerShadow} />

      {/* ✅ 여기 아래부터는 나중에 컴포넌트 붙일 자리 */}
      <View style={styles.body}>
          <MetricChartCard
            title="수축·이완(mmHg)"
            onPressInfo={() => console.log('info')}
            onPressAdd={() => console.log('add')}
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
                  reverseX={true}
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
                      data: slice.map(d => ({ xLabel: d.xLabel, value: d.systolic })),
                    },
                    {
                      key: 'dia',
                      stroke: '#9CA3AF',
                      data: slice.map(d => ({ xLabel: d.xLabel, value: d.diastolic })),
                    },
                  ]}
                />
              )}
                renderYAxis={(h) => <BloodPressureYAxis height={h} />}
            />
            </MetricChartCard>
      </View>
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
  chartCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,      // 카드 안쪽 위아래 여백
    overflow: 'hidden',       // ✅ 카드 밖으로 삐져나오는 스크롤 컨텐츠 잘라주기
    },
});