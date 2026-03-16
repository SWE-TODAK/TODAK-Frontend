// MetricChartCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import InfoButton from './InfoButton';
import AddButton from './AddButton';
import ChartTitle, { ChartTitleCategory } from './ChartTitle';

type Props = {
  category: ChartTitleCategory;
  onPressInfo?: () => void;
  onPressAdd?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  infoRef?: React.Ref<any>;
};

export default function MetricChartCard({
  category,
  onPressInfo,
  onPressAdd,
  children,
  style,
  infoRef,
}: Props) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <InfoButton ref={infoRef} onPress={onPressInfo} />
        <ChartTitle category={category} />
        <AddButton onPress={onPressAdd} />
      </View>

      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 2,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  body: {
    paddingBottom: 12,
  },
});