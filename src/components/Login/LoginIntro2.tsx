// LoginIntro2.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoginIntro2: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>일정 관리</Text>
      <Text style={styles.description}>
        진료일정과 건강기록을{'\n'}
        한눈에 확인하세요.
      </Text>
    </View>
  );
};

export default LoginIntro2;

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
