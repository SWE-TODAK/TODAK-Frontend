// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FirstScreen from '../screens/FirstScreen';
import Login from '../screens/Login';
import AuthGate from '../screens/AuthGate';
import LocalLogin from '../screens/auth/LocalLogin';
import LocalPassword from '../screens/auth/LocalPassword';
import SignUpPassword from '../screens/auth/SignUpPassword';
import SignUpName from '../screens/auth/SignUpName';
import SignUpSex from '../screens/auth/SignUpSex';
import SignUpBirth from '../screens/auth/SignUpBirth';
import SignUpSuccess from '../screens/auth/SignUpSuccess';
import ResetPasswordVerify from '../screens/auth/ResetPasswordVerify';
import ResetPasswordNewPw from '../screens/auth/ResetPasswordNewPw';
import ResetPasswordSuccess from '../screens/auth/ResetPasswordSuccess';
import Reservation from '../screens/Reservation';
import MainTabNavigator from './MainTabNavigator';
import Setting from '../screens/setting/Setting';
import ProfileSetting from '../screens/setting/ProfileSetting';
import PrivacyHistory from '../screens/setting/PrivacyHistory';

// 🔥 추가됨: 나중에 실제 화면 만들기 전까지 임시 Placeholder 화면
import { View, Text } from 'react-native';

export type RootStackParamList = {
  First: undefined;
  Login: undefined;
  AuthGate: undefined;
  MainTabs: undefined;
  Reservation: undefined;
  Setting: undefined;
  ProfileSetting: undefined;
  PrivacyHistory: undefined;
  ChangePassword: undefined;

  LocalLogin: { email?: string; mode?: 'login' | 'signup' } | undefined;
  LocalPassword: { email: string };

    SignUpPassword: { email: string };
    SignUpName: { email: string; password: string };
    SignUpSex: { email: string; name: string; password: string };
    SignUpBirth: { email: string; name: string; sex: 'M' | 'F'; password: string };
  SignUpSuccess: { email: string; name: string; sex: 'M' | 'F'; birth: string };

  ResetPasswordVerify: { email: string };
  ResetPasswordNewPw: { email: string; code: string };
  ResetPasswordSuccess: { email?: string };

  Family: undefined;
  ReservationHistory: undefined;
  AppSetting: undefined;
  NotificationSetting: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="First" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthGate" component={AuthGate} />
        <Stack.Screen name="First" component={FirstScreen} />
        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="LocalLogin" component={LocalLogin} />
        <Stack.Screen name="LocalPassword" component={LocalPassword} />

        <Stack.Screen name="SignUpPassword" component={SignUpPassword} />
        <Stack.Screen name="SignUpName" component={SignUpName} />
        <Stack.Screen name="SignUpSex" component={SignUpSex} />
        <Stack.Screen name="SignUpBirth" component={SignUpBirth} />
        <Stack.Screen name="SignUpSuccess" component={SignUpSuccess} />

        <Stack.Screen name="ResetPasswordVerify" component={ResetPasswordVerify} />
        <Stack.Screen name="ResetPasswordNewPw" component={ResetPasswordNewPw} />
        <Stack.Screen name="ResetPasswordSuccess" component={ResetPasswordSuccess} />

        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Reservation" component={Reservation} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;