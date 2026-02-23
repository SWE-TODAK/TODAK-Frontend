import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Setting from '../screens/setting/Setting';
import ProfileSetting from '../screens/setting/ProfileSetting';
import PrivacyHistory from '../screens/setting/PrivacyHistory';

export type SettingStackParamList = {
  SettingMain: undefined;
  ProfileSetting: undefined;
  PrivacyHistory: undefined;
};

const Stack = createStackNavigator<SettingStackParamList>();

const SettingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingMain" component={Setting} />
      <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
      <Stack.Screen name="PrivacyHistory" component={PrivacyHistory} />
    </Stack.Navigator>
  );
};

export default SettingStackNavigator;