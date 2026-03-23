// src/navigation/HealthStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ✅ 너의 화면 파일 경로에 맞게 수정
import HealthHome from '../screens/health/MyHealth';           // "나의 건강지표" 있는 홈 화면
import HealthMetric from '../screens/health/HealthMetric';
import type { HealthMetricCategory } from '../components/Health/types/healthMetric.types';
import type { CustomHealthMetricItem } from '../components/Health/health-home/CreateCustomMetricSection';

export type HealthStackParamList = {
   HealthHome: undefined;
  HealthMetric:
    | {
        category: HealthMetricCategory;
        title: string;
        isCustom?: false;
        customMetric?: undefined;
      }
    | {
        category?: undefined;
        title: string;
        isCustom: true;
        customMetric: CustomHealthMetricItem;
      };
};

const Stack = createNativeStackNavigator<HealthStackParamList>();

export default function HealthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HealthHome" component={HealthHome} />
      <Stack.Screen name="HealthMetric" component={HealthMetric} />
    </Stack.Navigator>
  );
}