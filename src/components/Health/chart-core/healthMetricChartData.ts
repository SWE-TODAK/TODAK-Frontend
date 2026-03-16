// src/components/Health/chart-core/healthMetricChartData.ts

import { MetricSeriesConfig, ZoneLevel, MetricZone } from '../types/healthMetric.types';
import {
  BloodPressureRecord,
  BloodSugarRecord,
  LiverRecord,
  KidneyRecord,
  LipidRecord,
  BodyRecord,
} from './healthMetricMockData';

type ChartPoint = {
  xLabel: string;
  value: number;
};

type ChartSeries = {
  key: string;
  data: ChartPoint[];
  stroke: string;
};

type ChartZone = {
  from: number;
  to: number;
  fill: string;
  opacity: number;
};

const getSeriesColor = (
  seriesConfig: MetricSeriesConfig[],
  key: string,
  fallback: string
): string => {
  return seriesConfig.find(series => series.key === key)?.color ?? fallback;
};

const getZoneFill = (level: ZoneLevel): string => {
  switch (level) {
    case 'danger':
      return '#FCA5A5';
    case 'warning':
      return '#FDE68A';
    case 'normal':
    default:
      return '#A7F3C0';
  }
};

export const buildChartZones = (zones?: MetricZone[]): ChartZone[] => {
  if (!zones?.length) return [];

  return zones.map(zone => ({
    from: zone.min,
    to: zone.max,
    fill: getZoneFill(zone.level),
    opacity: 0.85,
  }));
};

export const buildBloodPressureChartSeries = (
  records: BloodPressureRecord[],
  seriesConfig: MetricSeriesConfig[]
): ChartSeries[] => {
  return [
    {
      key: 'sys',
      data: records.map(record => ({
        xLabel: record.xLabel,
        value: record.systolic,
      })),
      stroke: getSeriesColor(seriesConfig, 'sys', '#2563EB'),
    },
    {
      key: 'dia',
      data: records.map(record => ({
        xLabel: record.xLabel,
        value: record.diastolic,
      })),
      stroke: getSeriesColor(seriesConfig, 'dia', '#EAB308'),
    },
  ];
};

export const buildBloodSugarChartSeries = (
  records: BloodSugarRecord[],
  seriesConfig: MetricSeriesConfig[]
): ChartSeries[] => {
  return [
    {
      key: 'glucose',
      data: records.map(record => ({
        xLabel: record.xLabel,
        value: record.glucose,
      })),
      stroke: getSeriesColor(seriesConfig, 'glucose', '#22C55E'),
    },
  ];
};

export const buildLiverChartSeries = (
  records: LiverRecord[],
  seriesConfig: MetricSeriesConfig[]
): ChartSeries[] => {
  return [
    {
      key: 'alt',
      data: records.map(record => ({
        xLabel: record.xLabel,
        value: record.alt,
      })),
      stroke: getSeriesColor(seriesConfig, 'alt', '#F97316'),
    },
  ];
};

export const buildKidneyChartSeries = (
  records: KidneyRecord[],
  seriesConfig: MetricSeriesConfig[]
): ChartSeries[] => {
  return [
    {
      key: 'creatinine',
      data: records.map(record => ({
        xLabel: record.xLabel,
        value: record.creatinine,
      })),
      stroke: getSeriesColor(seriesConfig, 'creatinine', '#6366F1'),
    },
  ];
};

export const buildLipidChartSeries = (
  records: LipidRecord[],
  seriesConfig: MetricSeriesConfig[]
): ChartSeries[] => {
  return [
    {
      key: 'ldl',
      data: records.map(record => ({
        xLabel: record.xLabel,
        value: record.ldl,
      })),
      stroke: getSeriesColor(seriesConfig, 'ldl', '#EF4444'),
    },
    {
      key: 'hdl',
      data: records.map(record => ({
        xLabel: record.xLabel,
        value: record.hdl,
      })),
      stroke: getSeriesColor(seriesConfig, 'hdl', '#10B981'),
    },
  ];
};

export const buildBodyChartSeries = (
  records: BodyRecord[],
  seriesConfig: MetricSeriesConfig[]
): ChartSeries[] => {
  return [
    {
      key: 'weight',
      data: records.map(record => ({
        xLabel: record.xLabel,
        value: record.weight,
      })),
      stroke: getSeriesColor(seriesConfig, 'weight', '#3B82F6'),
    },
  ];
};