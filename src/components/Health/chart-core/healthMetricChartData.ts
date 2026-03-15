// src/components/Health/chart-core/healthMetricChartData.ts

type BloodPressureRecord = {
  xLabel: string;
  systolic: number;
  diastolic: number;
};

type MetricSeriesConfig = {
  key: string;
  color: string;
};

type ChartPoint = {
  xLabel: string;
  value: number;
};

type ChartSeries = {
  key: string;
  data: ChartPoint[];
  stroke: string;
};

const getSeriesColor = (
  seriesConfig: MetricSeriesConfig[],
  key: string,
  fallback: string
) => {
  return seriesConfig.find(series => series.key === key)?.color ?? fallback;
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

type BloodSugarRecord = {
  xLabel: string;
  glucose: number;
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

type ZoneLevel = 'danger' | 'warning' | 'normal';

type MetricZone = {
  min: number;
  max: number;
  level: ZoneLevel;
  label?: string;
};

type ChartZone = {
  from: number;
  to: number;
  fill: string;
  opacity: number;
};

const getZoneFill = (level: ZoneLevel) => {
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