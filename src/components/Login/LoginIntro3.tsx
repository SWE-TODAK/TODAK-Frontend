// LoginIntro3.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoginIntro3: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>병원 예약</Text>
      <Text style={styles.description}>
        복잡한 병원 예약,{'\n'}
        토닥에서 한눈에 정리하세요.
      </Text>
    </View>
  );
};

export default LoginIntro3;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
  },
});
