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
      key: 'systolic',
      label: '수축기 혈압',
      placeholder: '120',
      keyboardType: 'numeric',
      unit: 'mmHg',
      required: true,
    },
    {
      key: 'diastolic',
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
      key: 'beforeMeal',
      label: '식전 혈당',
      placeholder: '90',
      keyboardType: 'numeric',
      unit: 'mg/dL',
      required: true,
    },
    {
      key: 'afterMeal',
      label: '식후 혈당',
      placeholder: '140',
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
  liver: {
    category: 'liver',
    title: '간 기능',
    chartTitle: '간 기능 변화 추이',
    unit: 'U/L',
    yAxis: {
      min: 0,
      max: 100,
      ticks: [0, 25, 50, 75, 100],
    },
    series: [
      {
        key: 'alt',
        label: 'ALT',
        color: '#F97316',
        unit: 'U/L',
        zones: [
          { min: 0, max: 40, level: 'normal', label: '정상' },
          { min: 40, max: 60, level: 'warning', label: '주의' },
          { min: 60, max: 100, level: 'danger', label: '높음' },
        ],
      },
    ],
    inputFields: [
      {
        key: 'alt',
        label: 'ALT',
        placeholder: '25',
        keyboardType: 'numeric',
        unit: 'U/L',
        required: true,
      },
    ],
    defaultSelectedSeriesKey: 'alt',
    infoModal: {
      title: '간 기능 수치 기준',
      bullets: [
        '일반적으로 ALT 40U/L 이하를 정상 범위로 봅니다.',
        '수치가 높으면 간세포 손상 여부를 함께 확인할 수 있어요.',
        '음주, 약물, 피로도에 따라 수치가 달라질 수 있습니다.',
      ],
      note: '정확한 해석은 다른 검사 결과와 함께 판단해야 합니다.',
    },
  },

  kidney: {
    category: 'kidney',
    title: '신장 기능',
    chartTitle: '신장 기능 변화 추이',
    unit: 'mg/dL',
    yAxis: {
      min: 0,
      max: 2,
      ticks: [0, 0.5, 1, 1.5, 2],
    },
    series: [
      {
        key: 'creatinine',
        label: '크레아티닌',
        color: '#6366F1',
        unit: 'mg/dL',
        zones: [
          { min: 0, max: 1.2, level: 'normal', label: '정상' },
          { min: 1.2, max: 1.5, level: 'warning', label: '주의' },
          { min: 1.5, max: 2, level: 'danger', label: '높음' },
        ],
      },
    ],
    inputFields: [
      {
        key: 'creatinine',
        label: '크레아티닌',
        placeholder: '0.9',
        keyboardType: 'numeric',
        unit: 'mg/dL',
        required: true,
      },
    ],
    defaultSelectedSeriesKey: 'creatinine',
  },

  lipid: {
    category: 'lipid',
    title: '지질 · 콜레스테롤',
    chartTitle: '콜레스테롤 변화 추이',
    unit: 'mg/dL',
    yAxis: {
      min: 0,
      max: 300,
      ticks: [0, 100, 200, 300],
    },
    series: [
      {
        key: 'ldl',
        label: 'LDL',
        color: '#EF4444',
        unit: 'mg/dL',
        zones: [
          { min: 0, max: 100, level: 'normal', label: '정상' },
          { min: 100, max: 160, level: 'warning', label: '주의' },
          { min: 160, max: 300, level: 'danger', label: '높음' },
        ],
      },
      {
        key: 'hdl',
        label: 'HDL',
        color: '#10B981',
        unit: 'mg/dL',
        zones: [
          { min: 0, max: 40, level: 'danger', label: '낮음' },
          { min: 40, max: 60, level: 'normal', label: '정상' },
          { min: 60, max: 120, level: 'normal', label: '좋음' },
        ],
      },
    ],
    inputFields: [
      {
        key: 'totalChol',
        label: '총콜레스테롤',
        placeholder: '180',
        keyboardType: 'numeric',
        unit: 'mg/dL',
        required: true,
      },
      {
        key: 'triglyceride',
        label: '중성지방',
        placeholder: '120',
        keyboardType: 'numeric',
        unit: 'mg/dL',
        required: true,
      },
      {
        key: 'hdl',
        label: 'HDL',
        placeholder: '50',
        keyboardType: 'numeric',
        unit: 'mg/dL',
        required: true,
      },
      {
        key: 'ldl',
        label: 'LDL',
        placeholder: '100',
        keyboardType: 'numeric',
        unit: 'mg/dL',
        required: true,
      },
    ],
    defaultSelectedSeriesKey: 'ldl',
  },
  body: {
    category: 'body',
    title: '체형 · 신체',
    chartTitle: '체중 변화 추이',
    unit: 'kg',
    yAxis: {
      min: 40,
      max: 120,
      ticks: [40, 60, 80, 100, 120],
    },
    series: [
      {
        key: 'weight',
        label: '체중',
        color: '#3B82F6',
        unit: 'kg',
        zones: [
          { min: 40, max: 60, level: 'normal', label: '정상' },
          { min: 60, max: 90, level: 'normal', label: '보통' },
          { min: 90, max: 120, level: 'warning', label: '주의' },
        ],
      },
    ],
    inputFields: [
      {
        key: 'weight',
        label: '체중',
        placeholder: '68',
        keyboardType: 'numeric',
        unit: 'kg',
        required: true,
      },
    ],
    defaultSelectedSeriesKey: 'weight',
  },
};