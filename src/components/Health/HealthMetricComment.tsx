// src/components/Health/HealthMetricComment.tsx
import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { HealthMetricType } from './HealthMetricTabs';

type MetricPoint = {
  dateLabel: string;
  value: number;
};

type Props = {
  metric: HealthMetricType;
  data: MetricPoint[];
};

type Status = 'good' | 'normal' | 'danger';

const statusLabel: Record<Status, string> = {
  good: '좋음',
  normal: '보통',
  danger: '위험',
};

// HealthMetricSection 에서 쓰는 기준이랑 똑같이 맞춰줌
function getStatus(metric: HealthMetricType, value: number): Status {
  switch (metric) {
    case 'bloodPressure':
      if (value < 120) return 'good';
      if (value < 140) return 'normal';
      return 'danger';
    case 'bloodSugar':
      if (value < 100) return 'good';
      if (value < 126) return 'normal';
      return 'danger';
    case 'liver':
      if (value < 40) return 'good';
      if (value < 80) return 'normal';
      return 'danger';
    default:
      return 'normal';
  }
}

// 카드 제목
const CARD_TITLE: Record<HealthMetricType, string> = {
  bloodPressure: '혈압 진단 결과',
  bloodSugar: '혈당 진단 결과',
  liver: '간수치 진단 결과',
};

// 단위
const UNIT: Record<HealthMetricType, string> = {
  bloodPressure: 'mmHg',
  bloodSugar: 'mg/dL',
  liver: 'IU/L',
};

// 상태별 코멘트 템플릿
const commentTemplates: Record<
  HealthMetricType,
  Record<Status, { line1: string; line2: string; line3: string }>
> = {
  bloodPressure: {
    good: {
      line1: '최근 측정 결과가 모두 정상 범위입니다.',
      line2: '수축기 평균 수치가 안정적으로 유지되고 있어요.',
      line3: '지금처럼 규칙적인 식습관과 가벼운 운동을 계속 이어가 주세요. 💚',
    },
    normal: {
      line1: '최근 측정 결과가 살짝 높은 편이에요.',
      line2: '스트레스, 수면, 나트륨 섭취를 조금만 더 신경 써 주세요.',
      line3: '가벼운 유산소 운동과 규칙적인 생활이 혈압 안정에 도움이 됩니다.',
    },
    danger: {
      line1: '혈압 수치가 권장 범위보다 높게 나타나고 있어요.',
      line2: '두통·어지러움 등이 있다면 꼭 의료진과 상담해 주세요.',
      line3: '식단 조절과 운동과 함께, 정기적인 혈압 체크가 필요해요.',
    },
  },
  bloodSugar: {
    good: {
      line1: '혈당이 건강한 범위에서 잘 유지되고 있습니다.',
      line2: '식후 급격한 혈당 상승이 없도록 지금의 패턴을 유지해 주세요.',
      line3: '규칙적인 식사와 가벼운 활동이 현재 상태 유지를 도와줘요. 💚',
    },
    normal: {
      line1: '혈당이 약간 올라가 있는 상태예요.',
      line2: '간식·야식·단 음료 섭취를 조금만 줄이면 더 좋아질 수 있어요.',
      line3: '식후 가벼운 산책만으로도 혈당 조절에 도움이 됩니다.',
    },
    danger: {
      line1: '혈당이 권장 범위를 넘어선 상태예요.',
      line2: '식단·운동 조절과 함께, 의료진과 상의해 보는 것이 좋아요.',
      line3: '갑작스러운 피로감·갈증 등이 있다면 꼭 진료를 권장드립니다.',
    },
  },
  liver: {
    good: {
      line1: '간수치가 안정적인 범위 안에 있어요.',
      line2: '과음만 피하신다면 지금 상태를 잘 유지하실 수 있습니다.',
      line3: '수면과 식습관을 규칙적으로 유지해 주세요. 💚',
    },
    normal: {
      line1: '간수치가 다소 올라가 있는 편이에요.',
      line2: '최근 음주·약물 복용·수면 부족이 있었는지 한 번 돌아봐 주세요.',
      line3: '당분간 음주를 줄이고 충분한 휴식을 취하는 것이 좋습니다.',
    },
    danger: {
      line1: '간수치가 정상 범위보다 높게 나타나고 있어요.',
      line2: '지속된다면 반드시 의료진과 상담해 정밀 검사를 받아보세요.',
      line3: '음주를 중단하고, 무리한 약물 복용은 피하는 것이 중요합니다.',
    },
  },
};

const HealthMetricComment: React.FC<Props> = ({ metric, data }) => {
  // 데이터 없으면 안전하게 처리
  const safeData = data && data.length > 0 ? data : [{ dateLabel: '', value: 0 }];

  const recent = safeData.slice(-3); // 최근 3개만 사용
  const avg =
    recent.reduce((sum, d) => sum + d.value, 0) /
    (recent.length || 1);

  const latestValue = recent[recent.length - 1].value;
  const status = getStatus(metric, latestValue);

  const template = commentTemplates[metric][status];

  return (
    <View style={styles.container}>
      {/* 제목 영역 */}
      <View style={styles.headerRow}>
        <Image
            source={require('../../assets/icons/check-blue.png')}
            style={styles.checkIcon}
          />
        <Text style={styles.title}>{CARD_TITLE[metric]}</Text>
      </View>

      {/* 요약 문장 + 평균 값 한 줄 추가 */}
      <View style={styles.body}>
        <Text style={styles.bodyText}>{template.line1}</Text>
        <Text style={styles.bodyText}>
          최근 {recent.length}회 평균&nbsp;
          <Text style={styles.bold}>
            {avg.toFixed(0)}
            {UNIT[metric]}
          </Text>
          로 {statusLabel[status]} 상태입니다.
        </Text>
        <Text style={styles.bodyText}>{template.line2}</Text>
        <Text style={styles.bodyText}>{template.line3}</Text>
      </View>
    </View>
  );
};

export default HealthMetricComment;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkIcon: {
    width: 29,
    height: 24,
    marginRight: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  body: {
    marginTop: 4,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4B5563',
    marginTop: 1,
  },
  bold: {
    fontWeight: '700',
    color: '#111827',
  },
});
