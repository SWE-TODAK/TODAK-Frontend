// src/screens/Health.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MainTabParamList } from '../navigation/MainTabNavigator';

type HealthScreenNavProp = BottomTabNavigationProp<MainTabParamList, 'Health'>;


import HealthMetricTabs, {
  HealthMetricType,
} from '../components/Health/HealthMetricTabs';
import HealthMetricSection from '../components/Health/HealthMetricSection';
import HealthMetricComment from '../components/Health/HealthMetricComment';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const Health: React.FC = () => {
  const navigation = useNavigation<HealthScreenNavProp>(); 
  const insets = useSafeAreaInsets();
  const [selectedMetric, setSelectedMetric] =
    useState<HealthMetricType>('bloodPressure');

    const bpData = [
      { dateLabel: '10.24', value: 115 },
      { dateLabel: '10.26', value: 135 },
      { dateLabel: '10.28', value: 140 },
    ];
  
    const sugarData = [
      { dateLabel: '10.24', value: 95 },
      { dateLabel: '10.26', value: 108 },
      { dateLabel: '10.28', value: 101 },
    ];
  
    const liverData = [
      { dateLabel: '10.24', value: 32 },
      { dateLabel: '10.26', value: 40 },
      { dateLabel: '10.28', value: 38 },
    ];
  
    const metricData =
      selectedMetric === 'bloodPressure'
        ? bpData
        : selectedMetric === 'bloodSugar'
        ? sugarData
        : liverData;

  return (
    <View style={styles.root}>
      {/* 🔼 상태바 높이만큼 흰색으로 덮기 */}
      <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />

      {/* 🔹 상단 헤더 */}
      <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}   // ← 메인(Home)으로 이동
      >
        <Image
          source={require('../assets/icons/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

        <Text style={styles.headerTitle}>건강지표 통계</Text>

        {/* 오른쪽 빈 공간 */}
        <View style={{ width: 32 }} />
      </View>

      {/* 🔹 헤더 아래 내용 */}
      <View style={styles.content}>
        {/* 혈당 / 혈압 / 간수치 탭 */}
        <HealthMetricTabs
          selected={selectedMetric}
          onChange={setSelectedMetric}
        />

        {/* 선택된 지표 섹션 (제목 + 상태 + 문구 + 그래프) */}
        <HealthMetricSection metric={selectedMetric} data={metricData}/>
        <HealthMetricComment metric={selectedMetric} data={metricData} />
      </View>
    </View>
  );
};

export default Health;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(236, 242, 252, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.8,
    borderBottomColor: '#AEAEAE',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
});
