import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import InfoButton from './InfoButton';
import AddButton from './AddButton';
import ChartTitle from './ChartTitle.tsx';

type Props = {
  title: string;
  onPressInfo?: () => void;
  onPressAdd?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function MetricChartCard({
  title,
  onPressInfo,
  onPressAdd,
  children,
  style,
}: Props) {

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <InfoButton onPress={onPressInfo} />
        <ChartTitle title={title} />
        <AddButton onPress={onPressAdd} />
      </View>

      <View style={styles.body}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
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