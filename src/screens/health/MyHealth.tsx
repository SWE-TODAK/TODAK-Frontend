// src/screens/Health.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HealthStackParamList } from '../../navigation/HealthStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import MyHealthMetricsSection from '../../components/Health/MyHealthMetricsSection';
import { MainTabParamList } from '../../navigation/MainTabNavigator';

type HealthScreenNavProp = BottomTabNavigationProp<
  MainTabParamList,
  'MyHealth'
>;

type HealthNavProp = NativeStackNavigationProp<
  HealthStackParamList,
  'HealthHome'
>;

const MyHealth: React.FC = () => {
 const tabNav = useNavigation<HealthScreenNavProp>();
 const stackNav = useNavigation<HealthNavProp>();
  
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {/* 헤더 (상태바 포함) */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => tabNav.navigate('Home')}
        >
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>건강지표</Text>

        {/* 오른쪽 빈 공간 */}
        <View style={{ width: 32 }} />
      </View>

      {/* ✅ 헤더 "아래"에 그림자 바 */}
      <View style={styles.headerShadow} />

      <MyHealthMetricsSection
        onPressItem={(category) => {
          const titleMap: Record<string, string> = {
            kidney: '신장 기능 (선택)',
            lipid: '지질 · 콜레스테롤',
            body: '체형 · 신체',
            bloodPressure: '혈압 · 심혈관',
            liver: '간 기능',
            bloodSugar: '혈당 · 당뇨',
          };

          stackNav.navigate('HealthMetric', {
            category,
            title: titleMap[category],
          });
        }}
      />
    </View>
  );
};

export default MyHealth;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 0.8)',
  },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  // ✅ 아래에만 보이게 만드는 "그림자 전용 바"
  headerShadow: {
    height: 0.5,
    backgroundColor: '#CCD1DA',
    elevation: 4,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});