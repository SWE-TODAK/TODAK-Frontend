import { HealthMetricConfig, HealthMetricCategory } from './types/healthMetric.types';

export const HEALTH_METRIC_CONFIG: Partial<Record<HealthMetricCategory, HealthMetricConfig>> = {
  bloodPressure: {
    category: 'bloodPressure',
    title: '혈압 · 심혈관',
    chartTitle: '혈압 변화 추이',
    unit: 'mmHg',
    yAxis: {
      min: 30,
      max: 150,
      ticks: [30, 60, 90, 120, 150],
    },
    series: [
      {
        key: 'sys',
        label: '수축기',
        color: '#FF6B6B',
        unit: 'mmHg',
        zones: [
          { min: 0, max: 90, level: 'danger', label: '저혈압' },
          { min: 90, max: 120, level: 'normal', label: '정상' },
          { min: 120, max: 140, level: 'warning', label: '주의' },
          { min: 140, max: 150, level: 'danger', label: '고혈압' },
        ],
      },
      {
        key: 'dia',
        label: '이완기',
        color: '#4D96FF',
        unit: 'mmHg',
        zones: [
          { min: 0, max: 60, level: 'danger', label: '저혈압' },
          { min: 60, max: 80, level: 'normal', label: '정상' },
          { min: 80, max: 90, level: 'warning', label: '주의' },
          { min: 90, max: 100, level: 'danger', label: '고혈압' },
        ],
      },
    ],
    inputFields: [
      {
        key: 'sys',
        label: '수축기 혈압',
        placeholder: '120',
        keyboardType: 'numeric',
        unit: 'mmHg',
        required: true,
      },
      {
        key: 'dia',
        label: '이완기 혈압',
        placeholder: '80',
        keyboardType: 'numeric',
        unit: 'mmHg',
        required: true,
      },
    ],
    defaultSelectedSeriesKey: 'sys',
    infoModal: {
      title: '혈압 수치 기준',
      bullets: [
        '정상 혈압: 120/80mmHg 미만',
        '고혈압: 140/90mmHg 이상',
        '저혈압: 90/60mmHg 이하',
      ],
      note: '증상 유무와 측정 상황에 따라 해석이 달라질 수 있습니다.',
    },
  },

  bloodSugar: {
    category: 'bloodSugar',
    title: '혈당',
    chartTitle: '혈당 변화 추이',
    unit: 'mg/dL',
    yAxis: {
      min: 50,
      max: 200,
      ticks: [50, 100, 150, 200],
    },
    series: [
      {
        key: 'glucose',
        label: '혈당',
        color: '#22C55E',
        unit: 'mg/dL',
        zones: [
          { min: 0, max: 70, level: 'danger', label: '저혈당' },
          { min: 70, max: 99, level: 'normal', label: '정상' },
          { min: 100, max: 125, level: 'warning', label: '주의' },
          { min: 126, max: 200, level: 'danger', label: '고혈당' },
        ],
      },
    ],
    inputFields: [
      {
        key: 'glucose',
        label: '혈당',
        placeholder: '95',
        keyboardType: 'numeric',
        unit: 'mg/dL',
        required: true,
      },
    ],
    defaultSelectedSeriesKey: 'glucose',
    infoModal: {
      title: '혈당 수치 기준',
      bullets: [
        '정상 공복혈당: 70~99mg/dL',
        '공복혈당장애: 100~125mg/dL',
        '당뇨병 의심: 126mg/dL 이상',
      ],
      note: '식사 여부와 측정 시점에 따라 기준 해석이 달라질 수 있습니다.',
    },
  },
};