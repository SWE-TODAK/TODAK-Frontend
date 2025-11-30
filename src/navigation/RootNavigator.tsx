// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FirstScreen from '../screens/FirstScreen';
import Login from '../screens/Login';
import AuthGate from '../screens/AuthGate';
import Reservation from '../screens/Reservation';

import MainTabNavigator from './MainTabNavigator';

export type RootStackParamList = {
  First: undefined;
  Login: undefined;
  AuthGate: undefined;
  MainTabs: undefined; // 탭 네비게이터
  Reservation: undefined;
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

        {/* 메인 페이지 = 탭 네비게이터 */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Reservation" component={Reservation} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
