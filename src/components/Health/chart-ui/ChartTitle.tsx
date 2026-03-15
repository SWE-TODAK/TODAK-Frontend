import React from 'react';
import { Text, StyleSheet } from 'react-native';

export type ChartTitleCategory =
  | 'kidney'
  | 'lipid'
  | 'body'
  | 'bloodPressure'
  | 'liver'
  | 'bloodSugar';

type Props = {
  category: ChartTitleCategory;
};

const TITLE_MAP: Record<ChartTitleCategory, string> = {
  kidney: '신장 기능',
  lipid: '지질 수치(mg/dL)',
  body: '체성분',
  bloodPressure: '수축·이완(mmHg)',
  liver: '간 수치(U/L)',
  bloodSugar: '혈당(mg/dL)',
};

export default function ChartTitle({ category }: Props) {
  return <Text style={styles.title}>{TITLE_MAP[category]}</Text>;
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
});