import { HealthMetricCategory } from './types/healthMetric';
export const METRIC_INFO: Record<
  HealthMetricCategory,
  {
    title: string;
    bullets: string[];
    note?: string;
  }
> = {
  bloodPressure: {
    title: '혈압 수치 기준',
    bullets: [
      '정상 혈압: 120/80mmHg 미만',
      '고혈압: 140/90mmHg 이상',
      '저혈압: 90/60mmHg 이하',
    ],
    note: '*증상 유무에 따라 진단이 달라질 수 있습니다',
  },

  bloodSugar: {
    title: '혈당 기준',
    bullets: [
      '공복 혈당 100mg/dL 미만 정상',
      '100~125mg/dL 전당뇨',
      '126mg/dL 이상 당뇨 의심',
    ],
  },

  liver: {
    title: '간 수치 기준',
    bullets: [
      'AST 정상: 0 ~ 40',
      'ALT 정상: 0 ~ 40',
    ],
  },

  kidney: {
    title: '신장 기능 기준',
    bullets: [
      '크레아티닌 정상: 0.7 ~ 1.3',
      'eGFR 60 이상 정상',
    ],
  },

  lipid: {
    title: '지질 수치 기준',
    bullets: [
      '총 콜레스테롤 200mg/dL 미만',
      'LDL 130 미만',
    ],
  },

  body: {
    title: '체성분 기준',
    bullets: [
      'BMI 18.5 ~ 23 정상',
      '23 이상 과체중',
    ],
  },
};