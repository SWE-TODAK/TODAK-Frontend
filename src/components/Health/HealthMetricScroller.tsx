import React, { useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props<T> = {
  records: T[];
  pointGap?: number;
  height?: number;

  yAxisWidth?: number; // ✅ 오른쪽 고정축 너비
  renderChart: (records: T[], chartWidth: number, height: number) => React.ReactElement;
  renderYAxis: (height: number) => React.ReactElement;

  showEmptyText?: boolean;
};

export default function HealthMetricScroller<T>({
  records,
  pointGap = 44,
  height = 320,
  yAxisWidth = 20,
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
      {/* ✅ 스크롤되는 그래프 영역 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ width: chartWidth, height }}>
          {renderChart(records, chartWidth, height)}
        </View>
      </ScrollView>

      {/* ✅ 오른쪽 고정 Y축 */}
      <View style={[styles.yAxis, { width: yAxisWidth, height }]}>
        {renderYAxis(height)}
      </View>
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
    backgroundColor: 'transparent',
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