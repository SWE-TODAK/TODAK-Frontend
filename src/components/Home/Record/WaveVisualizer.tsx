import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const BAR_COUNT = 50;

const WaveVisualizer = () => {
  const animValues = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.4)),
  ).current;

  const maxHeights = useRef(
    Array.from({ length: BAR_COUNT }, (_, i) => {
      const center = (BAR_COUNT - 1) / 2;
      const distance = Math.abs(i - center);

      const baseHeight = 90 - distance * 10;   // 중앙이 크고, 바깥으로 갈수록 작아짐
      const randomOffset = Math.random() * 16 - 8; // -8 ~ +8 정도 흔들림

      return Math.max(60, baseHeight + randomOffset);
    }),
  ).current;

  useEffect(() => {
    const center = (BAR_COUNT - 1) / 2;

    const loops = animValues.map((anim, index) => {
      const distance = Math.abs(index - center);
      const duration = 400 + distance * 35;

      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.5,
            duration,
            useNativeDriver: true,
          }),
        ]),
      );
    });

    loops.forEach(loop => loop.start());

    return () => {
      loops.forEach(loop => loop.stop());
    };
  }, [animValues]);

  return (
    <View style={styles.container}>
      {animValues.map((anim, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.bar,
            {
              height: maxHeights[idx],
              transform: [{ scaleY: anim }],
            },
          ]}
        />
      ))}
    </View>
  );
};

export default WaveVisualizer;

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    width: 3,
    marginHorizontal: 2,
    borderRadius: 999,
    backgroundColor: '#AEB3BD',
  },
});