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

  series: LineSeries[];

  yMin?: number;
  yMax?: number;
  yTicks?: number[];

  zones?: ChartZone[];

  reverseX?: boolean;
  showXLabels?: boolean;
  showXGrid?: boolean;
  showYGrid?: boolean;


  // ✅ 추가: 선택된 선 & 선택 콜백
  selectedKey?: string;
  selectedPoint?: { key: string; index: number } | null;
  onSelectSeries?: (key: string) => void;
  onSelectPoint?: (payload: {
    key: string;
    index: number;
    x: number;
    y: number;
    xLabel: string;
    value: number;
  }) => void;
  
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

  selectedKey,
  selectedPoint,
  onSelectSeries,
  onSelectPoint,
}: Props) {
  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 14;
  const paddingBottom = 26;

  const chartW = Math.max(1, width - paddingLeft - paddingRight);
  const chartH = Math.max(1, height - paddingTop - paddingBottom);

  const DENSE_DATA_THRESHOLD = 22;

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  const n = Math.max(0, ...series.map((s) => s.data.length), 0);
  const hideDenseDetails = n >= DENSE_DATA_THRESHOLD;
  
  const yToPx = (v: number) => {
    const vv = clamp(v, yMin, yMax);
    const t = (vv - yMin) / (yMax - yMin);
    return paddingTop + (1 - t) * chartH;
  };

  const xToPx = (i: number) => {
    if (n <= 1) return paddingLeft;
    const idx = reverseX ? (n - 1 - i) : i;
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
  const xLabels = series[0]?.data ?? [];

  return (
    <View>
      <Svg width={width} height={height}>
        {/* zones */}
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

        {/* y grid */}
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
                stroke="#CCCCCC"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

       {/* x grid */}
        {showXGrid &&
          !hideDenseDetails &&
          xGridIdxs.map((idx) => {
            const x = xToPx(idx);
            return (
              <Line
                key={`x-${idx}`}
                x1={x}
                x2={x}
                y1={paddingTop}
                y2={paddingTop + chartH}
                stroke="#CCCCCC"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

        {/* x labels */}
        {showXLabels &&
          !hideDenseDetails &&
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

        {/* lines + points */}
        {computed.map((s) => {
          const hasSelection = !!selectedKey;
          const isSelected = hasSelection && s.key === selectedKey;

          // ✅ 기본은 "전부 회색", 선택된 것만 파란색
          const baseGray = '#9CA3AF';
          const activeBlue = '#2563EB';
          const stroke = isSelected ? activeBlue : baseGray;

          // ✅ 선택된 건 진하게, 나머진 살짝 흐리게(원하면 1로 고정해도 됨)
          const lineOpacity = hasSelection ? (isSelected ? 1 : 0.45) : 1;

          const lineWidth = isSelected ? (s.strokeWidth ?? 3) + 1.8 : (s.strokeWidth ?? 3);
          const pointStrokeWidth = isSelected ? 4 : 3;
          const pointRadius = isSelected ? (s.pointRadius ?? 4) + 2 : (s.pointRadius ?? 4);

          return (
            <React.Fragment key={s.key}>
              <Path
                d={makePath(s.pts)}
                stroke={stroke}
                strokeWidth={lineWidth}
                opacity={lineOpacity}
                fill="none"
              />

              {!hideDenseDetails &&
              s.pts.map((p, i) => {
                const pointData = s.data[i];
                return (
                  <Circle
                    key={`${s.key}-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={pointRadius}
                    fill="#FFFFFF"
                    stroke={stroke}
                    strokeWidth={pointStrokeWidth}
                    opacity={lineOpacity}
                    onPress={() => {
                      onSelectSeries?.(s.key);
                      onSelectPoint?.({
                        key: s.key,
                        index: i,
                        x: p.x,
                        y: p.y,
                        xLabel: pointData.xLabel,
                        value: pointData.value,
                      });
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}