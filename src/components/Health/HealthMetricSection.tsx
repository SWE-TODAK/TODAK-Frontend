// src/components/mycare/HealthMetricSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Polyline, Circle,Line } from 'react-native-svg';
import { HealthMetricType } from './HealthMetricTabs';

type MetricPoint = {
  dateLabel: string; // 예: '10.24'
  value: number;     // 해당 지표 값
};

type Props = {
  metric: HealthMetricType;
  data: MetricPoint[];
};

type Status = 'good' | 'normal' | 'danger';

type MetricConfig = {
  title: string;
  graphTitle: string;
  minY: number;
  maxY: number;
  normalMin: number;
  normalMax: number;
  yTicks: number[];
};

const GRAPH_WIDTH = 240;
const GRAPH_HEIGHT = 140;
const PADDING_X = 12;

// --- 지표별 축/정상범위 설정 ---
const METRIC_CONFIG: Record<HealthMetricType, MetricConfig> = {
  bloodPressure: {
    title: '혈압',
    graphTitle: '수축기 혈압(mmHg)',
    minY: 80,
    maxY: 140,
    normalMin: 110,
    normalMax: 130,
    yTicks: [80, 100, 120, 140],
  },
  bloodSugar: {
    title: '혈당',
    graphTitle: '공복 혈당(mg/dL)',
    minY: 70,
    maxY: 180,
    normalMin: 80,
    normalMax: 110,
    yTicks: [80, 110, 140, 170],
  },
  liver: {
    title: '간수치',
    graphTitle: '간수치(AST/ALT)',
    minY: 0,
    maxY: 120,
    normalMin: 10,
    normalMax: 40,
    yTicks: [0, 40, 80, 120],
  },
};

// --- 지표별 상태 판정 ---
function getStatus(metric: HealthMetricType, value: number): Status {
  switch (metric) {
    case 'bloodPressure':
      // <120 좋음, 120~139 보통, 140 이상 위험
      if (value < 120) return 'good';
      if (value < 140) return 'normal';
      return 'danger';
    case 'bloodSugar':
      // <100 좋음, 100~125 보통, 126 이상 위험
      if (value < 100) return 'good';
      if (value < 126) return 'normal';
      return 'danger';
    case 'liver':
      // <40 좋음, 40~79 보통, 80 이상 위험
      if (value < 40) return 'good';
      if (value < 80) return 'normal';
      return 'danger';
    default:
      return 'normal';
  }
}

// --- 배지 색상 ---
const statusLabel: Record<Status, string> = {
  good: '좋음',
  normal: '보통',
  danger: '위험',
};

const statusColors: Record<Status, { bg: string; text: string }> = {
  good: { bg: '#E5F7D9', text: '#3C8B2A' },
  normal: { bg: '#F7E9C4', text: '#8B5A14' },
  danger: { bg: '#FCE1E1', text: '#B91C1C' },
};

// --- 설명 문구 ---
const messages: Record<
  HealthMetricType,
  Record<Status, { line1: string; line2: string }>
> = {
  bloodPressure: {
    good: {
      line1: '혈압이 매우 안정적으로 유지되고 있어요!',
      line2: '지금처럼 규칙적인 생활과 가벼운 운동을 꾸준히 이어가 주세요.',
    },
    normal: {
      line1: '혈압이 안정적으로 유지되고 있네요!',
      line2: '꾸준한 운동과 식단 관리로 건강한 리듬을 이어가요.',
    },
    danger: {
      line1: '혈압 수치가 다소 높게 나타나고 있어요.',
      line2:
        '생활 습관을 점검하고 필요하다면 의료진과 상담해 보는 것이 좋아요.',
    },
  },
  bloodSugar: {
    good: {
      line1: '혈당이 좋은 범위에서 유지되고 있어요.',
      line2: '현재 생활 패턴을 잘 유지해 주세요.',
    },
    normal: {
      line1: '혈당이 약간 올라가 있는 상태예요.',
      line2: '식단과 활동량을 조금만 더 신경 써주면 금방 좋아질 수 있어요.',
    },
    danger: {
      line1: '혈당이 권장 범위를 넘어선 상태예요.',
      line2:
        '무리하지 않는 선에서 식단과 운동을 조절하고, 의료진과 상의해 보세요.',
    },
  },
  liver: {
    good: {
      line1: '간수치가 건강한 범위 안에 있어요.',
      line2: '지금처럼 과음은 피하고 규칙적인 생활을 유지해 주세요.',
    },
    normal: {
      line1: '간수치가 살짝 높아진 상태예요.',
      line2: '음주, 약물, 수면 패턴을 점검해 보면 도움이 될 수 있어요.',
    },
    danger: {
      line1: '간수치가 권장 범위보다 꽤 높게 나타나고 있어요.',
      line2: '꼭 의료진과 상담하여 자세한 검사를 받아보는 것이 좋아요.',
    },
  },
};


const HealthMetricSection: React.FC<Props> = ({ metric, data }) => {
  const config = METRIC_CONFIG[metric];

  const safeData = data && data.length > 0 ? data : [{ dateLabel: '', value: 0 }];
  const latest = safeData[safeData.length - 1].value;
  const status = getStatus(metric, latest);

  // 데이터 값 중 최대/최소
  const rawMax = Math.max(...safeData.map(d => d.value));
  const rawMin = Math.min(...safeData.map(d => d.value));

  // 위·아래 여유값
  const plotMaxY = Math.max(config.maxY, rawMax) + 5;   // +5 여유 위로
  const plotMinY = Math.min(config.minY, rawMin) - 5;   // -5 여유 아래로

  // Y 좌표 변환
  const valueToY = (v: number) => {
    const ratio = (v - plotMinY) / (plotMaxY - plotMinY);
    return GRAPH_HEIGHT - ratio * GRAPH_HEIGHT;
  };

  const stepX =
    safeData.length > 1
      ? (GRAPH_WIDTH - PADDING_X * 2) / (safeData.length - 1)
      : 0;

  const points = safeData.map((d, idx) => ({
    x: PADDING_X + stepX * idx,
    y: valueToY(d.value),
  }));

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const normalTop = valueToY(config.normalMax);
  const normalBottom = valueToY(config.normalMin);

  return (
    <View style={styles.sectionContainer}>
      {/* 제목 + 배지 */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{config.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[status].bg },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusColors[status].text },
            ]}
          >
            {statusLabel[status]}
          </Text>
        </View>
      </View>

      {/* 설명 문구 */}
      <View style={styles.description}>
        <Text style={styles.descLine}>
          {messages[metric][status].line1}
        </Text>
        <Text style={styles.descLine}>
          {messages[metric][status].line2}
        </Text>
      </View>

      {/* 그래프 영역 */}
      <View style={styles.graphBlock}>
        <Text style={styles.graphTitle}>{config.graphTitle}</Text>

        <View style={styles.graphRow}>
          {/* y축 라벨 */}
          <View style={styles.yAxis}>
            {config.yTicks
              .slice()
              .reverse()
              .map((v) => (
              <Text key={v} style={styles.yLabel}>
                {v}
              </Text>
            ))}
          </View>

          {/* SVG 그래프 (뒤에 흰 카드 X, 바로 연한 배경 + 초록 영역) */}
          <View style={styles.chartWrapper}>
          <Svg
            width="100%"
            height={GRAPH_HEIGHT}
            viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
          >
            {/* 정상 범위 영역 (초록 박스만 남김) */}
            <Rect
              x={PADDING_X}
              y={normalTop}
              width={GRAPH_WIDTH - PADDING_X * 2}
              height={normalBottom - normalTop}
              fill="rgba(132,225,104,0.48)"
              opacity={0.9}
            />

            {/* y축 값 기준 가로 그리드 라인 */}
            {config.yTicks.map((v) => {
              const y = valueToY(v);
              return (
                <Line
                  key={v}
                  x1={PADDING_X}
                  y1={y}
                  x2={GRAPH_WIDTH - PADDING_X}
                  y2={y}
                  stroke="#D9D9D9"
                  strokeWidth={1}
                  strokeOpacity={0.9}
                />
              );
            })}

            {/* 꺾은선 */}
            {points.length > 1 && (
              <Polyline
                points={polylinePoints}
                fill="none"
                stroke="#507BFF"
                strokeWidth={3}
              />
            )}

            {/* 포인트 동그라미 */}
            {points.map((p, idx) => (
              <Circle key={idx} cx={p.x} cy={p.y} r={4} fill="#507BFF" />
            ))}
          </Svg>

          </View>
        </View>

        {/* x축 날짜 */}
        <View style={styles.xAxis}>
          {safeData.map((d) => (
            <Text key={d.dateLabel} style={styles.xLabel}>
              {d.dateLabel}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HealthMetricSection;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    marginTop: 12,
  },
  descLine: {
    fontSize: 14,
    lineHeight: 22,
    color: '#111827',
  },
  graphBlock: {
    marginTop: 24,
  },
  graphTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  graphRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  yAxis: {
    width: 32,
    justifyContent: 'space-between',
    paddingVertical: 3,
    //marginTop:8,
    marginRight: 4,
  },
  yLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'right',
  },
  chartWrapper: {
    flex: 1,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 36,
    marginLeft:40,
  },
  xLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
});
