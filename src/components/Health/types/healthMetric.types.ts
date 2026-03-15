export type HealthMetricCategory =
  | 'bloodPressure'
  | 'bloodSugar'
  | 'liver'
  | 'kidney'
  | 'lipid'
  | 'body';

export type ZoneLevel = 'danger' | 'warning' | 'normal';

export interface MetricZone {
  min: number;
  max: number;
  level: ZoneLevel;
  label?: string;
}

export interface MetricSeriesConfig {
  key: string;
  label: string;
  color: string;
  unit?: string;
  zones?: MetricZone[];
}

export interface MetricInputFieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  unit?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export interface HealthMetricConfig {
  category: HealthMetricCategory;
  title: string;
  chartTitle: string;
  unit?: string;
  yAxis: {
    min: number;
    max: number;
    ticks: number[];
  };
  series: MetricSeriesConfig[];
  inputFields: MetricInputFieldConfig[];
  defaultSelectedSeriesKey?: string;
  guide?: {
    normalText?: string;
    cautionText?: string;
    infoText?: string;
  };
  infoModal?: MetricInfoModalContent;
}

export interface MetricInfoModalContent {
  title: string;
  bullets: string[];
  note?: string;
}