// src/screens/HealthMetric.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type HealthMetricCategory =
  | 'kidney'
  | 'lipid'
  | 'body'
  | 'bloodPressure'
  | 'liver'
  | 'bloodSugar';

export type HealthStackParamList = {
  HealthHome: undefined;
  HealthMetric: { category: HealthMetricCategory; title: string };
};

type NavProp = NativeStackNavigationProp<HealthStackParamList, 'HealthMetric'>;
type RouteProps = RouteProp<HealthStackParamList, 'HealthMetric'>;

const HealthMetric: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();

  const { title } = route.params;

  return (
    <View style={styles.root}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={{ width: 32 }} />
      </View>

      {/* 헤더 아래 라인/그림자 */}
      <View style={styles.headerShadow} />

      {/* ✅ 여기 아래부터는 나중에 컴포넌트 붙일 자리 */}
      <View style={styles.body}>
        {/* 예: <RecentRecordFilter /> */}
        {/* 예: <MetricChartCard /> */}
        {/* 예: <MetricCommentCard /> */}
      </View>
    </View>
  );
};

export default HealthMetric;

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
  body: {
    flex: 1,
    paddingTop: 16,
  },
});