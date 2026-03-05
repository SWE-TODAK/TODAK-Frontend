import React, { useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props<T> = {
  records: T[];
  pointGap?: number;
  height?: number;

  yAxisWidth?: number; // ✅ 왼쪽 고정축 너비
  renderChart: (records: T[], chartWidth: number, height: number) => React.ReactElement;
  renderYAxis: (height: number) => React.ReactElement;

  showEmptyText?: boolean;
};

export default function HealthMetricScroller<T>({
  records,
  pointGap = 44,
  height = 320,
  yAxisWidth = 40, // ✅ 기본값도 살짝 넉넉하게(원하면 24~40 사이)
  renderChart,
  renderYAxis,
  showEmptyText = true,
}: Props<T>) {
  const chartWidth = useMemo(() => {
    const minWidth = SCREEN_WIDTH - 40 - yAxisWidth; // 카드 padding(20*2) + 축 너비
    const w = Math.max(minWidth, records.length * pointGap);
    return w;
  }, [records.length, pointGap, yAxisWidth]);

  if (records.length === 0) {
    return showEmptyText ? (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>표시할 기록이 없어요.</Text>
      </View>
    ) : null;
  }

  return (
    <View style={[styles.row, { height }]}>
      {/* ✅ 왼쪽 고정 Y축 */}
      <View style={[styles.yAxis, { width: yAxisWidth, height }]}>
        {renderYAxis(height)}
      </View>

      {/* ✅ 스크롤되는 그래프 영역 (inverted 트릭) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ transform: [{ scaleX: -1 }] }}              // 🔥 스크롤 방향/시작점 뒤집기
        contentContainerStyle={{ height,paddingLeft: 16 }}
      >
        <View style={{ width: chartWidth, height, transform: [{ scaleX: -1 }] }}>
          {/* 🔥 컨텐츠는 다시 정상 방향으로 */}
          {renderChart(records, chartWidth, height)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  yAxis: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF', // ✅ 카드랑 같은 흰색 추천
  },
  empty: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
  },
});