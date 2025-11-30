// navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 실제 화면들
import MainScreen from '../screens/MainScreen';
import Health from '../screens/Health';
import Mycare from '../screens/Mycare'
// 나머지는 일단 더미 화면
import { View, Text,Image } from 'react-native';

export type MainTabParamList = {
  Home: undefined;
  Calendar: undefined;
  Health: undefined;
  MyCare: undefined;
  Setting: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const DummyScreen = ({ label }: { label: string }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{label}</Text>
  </View>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
    headerShown: false,
    tabBarShowLabel: true,
    tabBarLabelStyle: { fontSize: 11 },
    tabBarActiveTintColor: '#3B82F6',
    tabBarInactiveTintColor: '#AEB3BD',
    tabBarStyle: {
      height: 130,
      backgroundColor: '#FFFFFF',
      elevation: 0,
      borderTopWidth:1,
      paddingTop : 15,
    },

    tabBarIcon: ({ focused }) => {
      let icon;
      let size = { width: 26, height: 26 }; // 기본값
      let gap =0;
    
      if (route.name === 'Home') {
        icon = focused
          ? require('../assets/icons/home-active.png')
          : require('../assets/icons/home-inactive.png');
        size = { width: 33, height: 33 }; // 홈만 크게
        gap = 5;
      } 
      else if (route.name === 'Calendar') {
        icon = focused
          ? require('../assets/icons/calendar-active.png')
          : require('../assets/icons/calendar-inactive.png');
        size = { width: 30, height: 30 }; // 캘린더 작게
      }
      else if (route.name === 'Health') {
        icon = focused
          ? require('../assets/icons/health-active.png')
          : require('../assets/icons/health-inactive.png');
        size = { width: 28, height: 28 };
      }
      else if (route.name === 'MyCare') {
        icon = focused
          ? require('../assets/icons/mycare-active.png')
          : require('../assets/icons/mycare-inactive.png');
        size = { width: 24, height: 24 };
      }
      else if (route.name === 'Setting') {
        icon = focused
          ? require('../assets/icons/setting-active.png')
          : require('../assets/icons/setting-inactive.png');
        size = { width: 28, height: 28};
      }
    
      return (
        <Image
          source={icon}
          style={{
            ...size,
            marginBottom: gap, // 🌟 각 탭별 간격 관리
          }}
          resizeMode="contain"
          
        />
      );
    },
  })}
>
  <Tab.Screen
    name="Home"
    component={MainScreen}
    options={{ tabBarLabel: '홈' }}
  />
  <Tab.Screen
    name="Calendar"
    children={() => <DummyScreen label="캘린더" />}
    options={{ tabBarLabel: '캘린더' }}
  />
  <Tab.Screen
    name="Health"
    component={Health}
    options={{ tabBarLabel: '건강관리' }}
  />
  <Tab.Screen
    name="MyCare"
    component={Mycare}
    options={{ tabBarLabel: '내 진료' }}
  />
  <Tab.Screen
    name="Setting"
    children={() => <DummyScreen label="더보기" />}
    options={{ tabBarLabel: '더보기' }}
  />
</Tab.Navigator>

  );
};

export default MainTabNavigator;
