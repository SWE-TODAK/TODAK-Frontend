import React from 'react';
import Svg, { Text as SvgText } from 'react-native-svg';

type Props = {
  height: number;
  yMin?: number;
  yMax?: number;
  ticks?: number[];
};

export default function BloodPressureYAxis({
  height,
  yMin = 30,
  yMax = 150,
  ticks = [30, 60, 90, 120, 150],
}: Props) {
  const paddingTop = 14;
  const paddingBottom = 26;
  const chartH = Math.max(1, height - paddingTop - paddingBottom);

  const yToPx = (v: number) => {
    const t = (v - yMin) / (yMax - yMin);
    return paddingTop + (1 - t) * chartH;
  };

  return (
    <Svg width="100%" height={height}>
      {ticks.map((t) => (
        <SvgText
          key={t}
          x="68%"
          y={yToPx(t) + 4}
          fontSize="12"
          fontWeight="700"
          fill="#374151"
          textAnchor="end"
        >
          {t}
        </SvgText>
      ))}
    </Svg>
  );
}