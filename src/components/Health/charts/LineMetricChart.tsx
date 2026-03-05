// src/components/Health/charts/LineMetricChart.tsx
import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Line, Path, Circle, Text as SvgText } from 'react-native-svg';

export type MetricPoint = {
  xLabel: string;
  value: number;
};

export type LineSeries = {
  key: string;              // 'sys', 'dia' 같은 식별자
  data: MetricPoint[];
  stroke: string;           // 선 색
  strokeWidth?: number;     // 기본 3
  pointStroke?: string;     // 점 테두리 색 (기본 stroke)
  pointFill?: string;       // 점 내부색 (기본 #fff)
  pointRadius?: number;     // 기본 4
};

export type ChartZone = {
  from: number;             // 하한
  to: number;               // 상한
  fill: string;
  opacity?: number;
};

type Props = {
  width: number;
  height: number;

  series: LineSeries[];     // ✅ 1개도 가능, 여러 개도 가능

  yMin?: number;            // 기본 30
  yMax?: number;            // 기본 150
  yTicks?: number[];        // 기본 [30,60,90,120,150]

  zones?: ChartZone[];      // 혈압 구간 배경 같은 것 (없으면 안 그림)

  reverseX?: boolean;       // ✅ 최신이 오른쪽에 오게 하려면 true
  showXLabels?: boolean;    // 기본 true
  showXGrid?: boolean;      // 기본 true
  showYGrid?: boolean;      // 기본 true
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  return points.reduce((acc, p, i) => {
    const cmd = i === 0 ? 'M' : 'L';
    return `${acc} ${cmd} ${p.x} ${p.y}`;
  }, '');
}

export default function LineMetricChart({
  width,
  height,
  series,

  yMin = 30,
  yMax = 150,
  yTicks = [30, 60, 90, 120, 150],

  zones = [],

  reverseX = true,
  showXLabels = true,
  showXGrid = true,
  showYGrid = true,
}: Props) {
  // ✅ 차트 내부 패딩(이건 “차트 내용”만 조절)
  const paddingLeft = 6;
  const paddingRight = 10;
  const paddingTop = 14;
  const paddingBottom = 26; // x라벨 자리 포함

  const chartW = Math.max(1, width - paddingLeft - paddingRight);
  const chartH = Math.max(1, height - paddingTop - paddingBottom);

  // ✅ 전체 점 개수(가장 긴 series 기준)
  const n = Math.max(0, ...series.map((s) => s.data.length), 0);

  const yToPx = (v: number) => {
    const vv = clamp(v, yMin, yMax);
    const t = (vv - yMin) / (yMax - yMin); // 0~1
    return paddingTop + (1 - t) * chartH;
  };

  const xToPx = (i: number) => {
    if (n <= 1) return paddingLeft;
    const idx = reverseX ? (n - 1 - i) : i; // ✅ 뒤집기 옵션
    return paddingLeft + (idx / (n - 1)) * chartW;
  };

  const computed = useMemo(() => {
    return series.map((s) => ({
      ...s,
      pts: s.data.map((d, i) => ({ x: xToPx(i), y: yToPx(d.value) })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, width, height, yMin, yMax, reverseX]);

  const xGridIdxs = n <= 1 ? [0] : Array.from({ length: n }, (_, i) => i);

  // ✅ x라벨은 첫 번째 series 기준(없으면 빈 배열)
  const xLabels = series[0]?.data ?? [];

  return (
    <View>
      <Svg width={width} height={height}>
        {/* ✅ 배경 구간(zones) */}
        {zones.map((z, idx) => {
          const top = yToPx(z.to);
          const bottom = yToPx(z.from);
          return (
            <Rect
              key={`z-${idx}`}
              x={paddingLeft}
              y={top}
              width={chartW}
              height={Math.max(0, bottom - top)}
              fill={z.fill}
              opacity={z.opacity ?? 0.7}
            />
          );
        })}

        {/* ✅ y축 격자 */}
        {showYGrid &&
          yTicks.map((t) => {
            const y = yToPx(t);
            return (
              <Line
                key={`y-${t}`}
                x1={paddingLeft}
                x2={paddingLeft + chartW}
                y1={y}
                y2={y}
                stroke="#D1D5DB"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

        {/* ✅ x축 격자(점마다) */}
        {showXGrid &&
          xGridIdxs.map((idx) => {
            const x = xToPx(idx);
            return (
              <Line
                key={`x-${idx}`}
                x1={x}
                x2={x}
                y1={paddingTop}
                y2={paddingTop + chartH}
                stroke="#D1D5DB"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

        {/* ✅ X축 라벨 */}
        {showXLabels &&
          xLabels.map((d, i) => {
            const x = xToPx(i);
            const y = paddingTop + chartH + 18;
            return (
              <SvgText
                key={`xl-${i}`}
                x={x}
                y={y}
                fontSize="11"
                fontWeight="600"
                fill="#333333"
                textAnchor="middle"
              >
                {d.xLabel}
              </SvgText>
            );
          })}

        {/* ✅ 라인 + 점 (series 수만큼) */}
        {computed.map((s) => (
          <React.Fragment key={s.key}>
            <Path
              d={makePath(s.pts)}
              stroke={s.stroke}
              strokeWidth={s.strokeWidth ?? 3}
              fill="none"
            />
            {s.pts.map((p, i) => (
              <Circle
                key={`${s.key}-${i}`}
                cx={p.x}
                cy={p.y}
                r={s.pointRadius ?? 4}
                fill={s.pointFill ?? '#FFFFFF'}
                stroke={s.pointStroke ?? s.stroke}
                strokeWidth={3}
              />
            ))}
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}