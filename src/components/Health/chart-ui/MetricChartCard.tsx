// MetricChartCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import InfoButton from './InfoButton';
import AddButton from './AddButton';
import ChartTitle from './ChartTitle';

type Props = {
  title: string;
  onPressInfo?: () => void;
  onPressAdd?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;

  infoRef?: React.Ref<any>; // ✅ 타입은 일단 any로 (안정적으로)
};

export default function MetricChartCard({
  title,
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
        <ChartTitle title={title} />
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