// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FirstScreen from '../screens/FirstScreen';
import Login from '../screens/Login';
import AuthGate from '../screens/AuthGate';
import LocalLogin from '../screens/auth/LocalLogin';
import LocalPassword from '../screens/auth/LocalPassword';
import SignUpFlow from '../screens/auth/SignUpFlow';
import ResetPasswordVerify from '../screens/auth/ResetPasswordVerify';
import Reservation from '../screens/Reservation';
import MainTabNavigator from './MainTabNavigator';

import Setting from '../screens/Setting';

// 🔥 추가됨: 나중에 실제 화면 만들기 전까지 임시 Placeholder 화면
import { View, Text } from 'react-native';


export type RootStackParamList = {
  First: undefined;
  Login: undefined;
  AuthGate: undefined;
  MainTabs: undefined; 
  Reservation: undefined;
  Setting: undefined;
  LocalLogin: { email: string };
  LocalPassword: { email: string };
  SignUpFlow: { email: string };
  ResetPasswordVerify: { email: string };

  // 🔥 설정 메뉴 관련 화면들 추가
  Family: undefined;
  ReservationHistory: undefined;
  AppSetting: undefined;
  NotificationSetting: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="First"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="AuthGate" component={AuthGate} />
        <Stack.Screen name="First" component={FirstScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LocalLogin" component={LocalLogin} />
        <Stack.Screen name="LocalPassword" component={LocalPassword} />
        <Stack.Screen name="SignUpFlow" component={SignUpFlow} />
        <Stack.Screen name="ResetPasswordVerify" component={ResetPasswordVerify} />

        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Reservation" component={Reservation} />

        {/* 🔥 Setting 자체 화면도 등록 */}
        <Stack.Screen name="Setting" component={Setting} />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
