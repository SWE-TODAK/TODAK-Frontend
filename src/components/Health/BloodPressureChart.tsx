import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Line, Path, Circle, Text as SvgText } from 'react-native-svg';

export type BloodPressurePoint = {
  xLabel: string;
  systolic: number;   // 수축기
  diastolic: number;  // 이완기
};

type Props = {
  data: BloodPressurePoint[];
  width: number;
  height: number;

  // y축 범위(스샷 기준)
  yMin?: number; // 기본 30
  yMax?: number; // 기본 150

  // 구간(초록/노랑/빨강) 기준
  greenMin?: number; // 90
  greenMax?: number; // 120
  yellowMax?: number; // 140
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

export default function BloodPressureChart({
  data,
  width,
  height,
  yMin = 30,
  yMax = 150,
  greenMin = 90,
  greenMax = 120,
  yellowMax = 140,
}: Props) {
  const paddingLeft = 20;   // y축 숫자 자리
  const paddingRight = 5;
  const paddingTop = 14;
  const paddingBottom = 26;

  const chartW = Math.max(1, width - paddingLeft - paddingRight);
  const chartH = Math.max(1, height - paddingTop - paddingBottom);

  const yToPx = (v: number) => {
    const vv = clamp(v, yMin, yMax);
    const t = (vv - yMin) / (yMax - yMin); // 0~1
    return paddingTop + (1 - t) * chartH;
  };

  const xToPx = (i: number) => {
    if (data.length <= 1) return paddingLeft;
    return paddingLeft + (i / (data.length - 1)) * chartW;
  };

  const { sysPts, diaPts } = useMemo(() => {
    const sys = data.map((d, i) => ({ x: xToPx(i), y: yToPx(d.systolic) }));
    const dia = data.map((d, i) => ({ x: xToPx(i), y: yToPx(d.diastolic) }));
    return { sysPts: sys, diaPts: dia };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, width, height, yMin, yMax]);

  // 배경 구간 높이 계산
  const greenTop = yToPx(greenMax);
  const greenBottom = yToPx(greenMin);
  const yellowTop = yToPx(yellowMax);
  const yellowBottom = yToPx(greenMax);
  const redTop = yToPx(yMax);
  const redBottom = yToPx(yellowMax);

  // 격자(y축 30,60,90,120,150)
  const yTicks = [30, 60, 90, 120, 150];

   // ✅ x축 격자: 점마다 하나씩
  const xGridIdxs =
    data.length <= 1 ? [0] : Array.from({ length: data.length }, (_, i) => i);

  return (
    <View>
      <Svg width={width} height={height}>
        {/* ✅ 배경 구간 */}
        <Rect
          x={paddingLeft}
          y={greenTop}
          width={chartW}
          height={Math.max(0, greenBottom - greenTop)}
          fill="#A7F3C0"
          opacity={0.85}
        />
        <Rect
          x={paddingLeft}
          y={yellowTop}
          width={chartW}
          height={Math.max(0, yellowBottom - yellowTop)}
          fill="#FDE68A"
          opacity={0.75}
        />
        <Rect
          x={paddingLeft}
          y={redBottom}
          width={chartW}
          height={Math.max(0, yToPx(yellowMax) - yToPx(yMax))}
          fill="#FCA5A5"
          opacity={0.65}
        />

        {/* ✅ y축 격자 + 라벨 */}
        {yTicks.map((t) => {
          const y = yToPx(t);
          return (
            <React.Fragment key={`y-${t}`}>
              <Line
                x1={paddingLeft}
                x2={paddingLeft + chartW}
                y1={y}
                y2={y}
                stroke="#D1D5DB"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            </React.Fragment>
          );
        })}

        {/* ✅ X축 라벨 */}
        {data.map((d, i) => {
          const x = xToPx(i);
          const y = paddingTop + chartH + 18; // 아래쪽 위치

          return (
            <SvgText
              key={`xl-${i}`}
              x={x}
              y={y}
              fontSize="12"
              fontWeight="700"
              fill="#374151"
              textAnchor="middle"
            >
              {d.xLabel}
            </SvgText>
          );
        })}

        {/* ✅ x축 격자 */}
        {xGridIdxs.map((idx) => {
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

        {/* ✅ 수축기(파란 선) */}
        <Path d={makePath(sysPts)} stroke="#1D4ED8" strokeWidth={3} fill="none" />

        {/* ✅ 이완기(회색 선) */}
        <Path d={makePath(diaPts)} stroke="#9CA3AF" strokeWidth={3} fill="none" />

        {/* ✅ 점 */}
        {sysPts.map((p, i) => (
          <Circle key={`s-${i}`} cx={p.x} cy={p.y} r={4} fill="#FFFFFF" stroke="#1D4ED8" strokeWidth={3} />
        ))}
        {diaPts.map((p, i) => (
          <Circle key={`d-${i}`} cx={p.x} cy={p.y} r={4} fill="#FFFFFF" stroke="#9CA3AF" strokeWidth={3} />
        ))}
      </Svg>
    </View>
  );
}