// LoginIntro1.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoginIntro1: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>진료 녹음</Text>
      <Text style={styles.description}>
        중요한 진료 내용을 놓치지 않게{'\n'}
        음성으로 간편히 기록하세요
      </Text>
    </View>
  );
};

export default LoginIntro1;

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
