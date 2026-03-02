// src/navigation/MycareStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Mycare from '../screens/Mycare';
import MycareDetail from '../screens/MycareDetail';

export type MycareRecordParam = {
  id: string;
  dateLabel: string;
  clinicName: string;
  timeLabel: string;
  deptName: string;
  doctorName: string;
  diseaseName: string;
  summary: string;

  // 상세에서 쓰는 확장 필드 (더미/추후 API)
  fullText?: string;
  memo?: string;
  hasAudio?: boolean;
};

export type MycareStackParamList = {
  Mycare: undefined;
  MycareDetail: {
    recordId: string;
    records: any[]; // 지금은 더미라 any로, 나중에 MycareRecord 확장 타입으로 바꾸면 됨
  };
};

const Stack = createNativeStackNavigator<MycareStackParamList>();

export default function MycareStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MycareMain" component={Mycare} />
      <Stack.Screen name="MycareDetail" component={MycareDetail} />
    </Stack.Navigator>
  );
}