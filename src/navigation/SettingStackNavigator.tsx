import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Setting from '../screens/setting/Setting';
import ProfileSetting from '../screens/setting/ProfileSetting';

export type SettingStackParamList = {
  SettingMain: undefined;
  ProfileSetting: undefined;
};

const Stack = createStackNavigator<SettingStackParamList>();

const SettingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingMain" component={Setting} />
      <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
    </Stack.Navigator>
  );
};

export default SettingStackNavigator;