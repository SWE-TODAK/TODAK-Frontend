// src/components/Health/chart-core/healthMetricViewData.ts

import { HealthMetricCategory, MetricSeriesConfig } from '../types/healthMetric.types';
import {
  buildBloodPressureChartSeries,
  buildBloodSugarChartSeries,
} from './healthMetricChartData';
import {
  bloodPressureMockRecords,
  bloodSugarMockRecords,
} from './healthMetricMockData';

export type DisplayRecord = {
  xLabel: string;
};

export const getFilteredBloodPressureRecords = (recordFilter: number | 'all') => {
  if (recordFilter === 'all') return bloodPressureMockRecords;
  return bloodPressureMockRecords.slice(-recordFilter);
};

export const getFilteredBloodSugarRecords = (recordFilter: number | 'all') => {
  if (recordFilter === 'all') return bloodSugarMockRecords;
  return bloodSugarMockRecords.slice(-recordFilter);
};

export const getDisplayRecordsByCategory = (
  category: HealthMetricCategory,
  recordFilter: number | 'all'
): DisplayRecord[] => {
  switch (category) {
    case 'bloodPressure':
      return getFilteredBloodPressureRecords(recordFilter).map(record => ({
        xLabel: record.xLabel,
      }));

    case 'bloodSugar':
      return getFilteredBloodSugarRecords(recordFilter).map(record => ({
        xLabel: record.xLabel,
      }));

    default:
      return [];
  }
};

export const getChartSeriesByCategory = (
  category: HealthMetricCategory,
  recordFilter: number | 'all',
  seriesConfig: MetricSeriesConfig[]
) => {
  switch (category) {
    case 'bloodPressure':
      return buildBloodPressureChartSeries(
        getFilteredBloodPressureRecords(recordFilter),
        seriesConfig
      );

    case 'bloodSugar':
      return buildBloodSugarChartSeries(
        getFilteredBloodSugarRecords(recordFilter),
        seriesConfig
      );

    default:
      return [];
  }
};