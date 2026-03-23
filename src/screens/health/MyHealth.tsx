// src/screens/Health.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HealthStackParamList } from '../../navigation/HealthStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import MyHealthMetricsSection from '../../components/Health/health-home/MyHealthMetricsSection.tsx';
import CreateCustomMetricSection, {
  CustomHealthMetricItem,
} from '../../components/Health/health-home/CreateCustomMetricSection';
import { MainTabParamList } from '../../navigation/MainTabNavigator';
import api from '../../api/axios';

type HealthScreenNavProp = BottomTabNavigationProp<MainTabParamList, 'MyHealth'>;

type HealthNavProp = NativeStackNavigationProp<
  HealthStackParamList,
  'HealthHome'
>;

type HealthMetricResponseItem = {
  metricId: string;
  name: string;
  unit?: string;
  metricType?: string;
  custom: boolean;
};

const MyHealth: React.FC = () => {
  const tabNav = useNavigation<HealthScreenNavProp>();
  const stackNav = useNavigation<HealthNavProp>();
  const insets = useSafeAreaInsets();

  const [customMetrics, setCustomMetrics] = useState<CustomHealthMetricItem[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const hasCustomMetrics = customMetrics.length > 0;
  useEffect(() => {
    if (customMetrics.length === 0 && isDeleteMode) {
      setIsDeleteMode(false);
    }
  }, [customMetrics, isDeleteMode]);

  const fetchHealthMetrics = async () => {
    try {
      const response = await api.get('/health/metrics');

      console.log('✅ 건강지표 목록 응답:', response.data);

      const metrics: HealthMetricResponseItem[] = response.data.data ?? [];

      const customOnly: CustomHealthMetricItem[] = metrics
        .filter(item => item.custom)
        .map(item => ({
          id: item.metricId,
          name: item.name,
          unit: item.unit ?? '',
        }));

      console.log('✅ 커스텀 지표 변환 결과:', customOnly);

      setCustomMetrics(customOnly);
    } catch (error: any) {
      console.error(
        '❌ 건강지표 목록 조회 실패:',
        error?.response?.data || error
      );
    }
  };
  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  const handleCreateCustomMetric = (item: CustomHealthMetricItem) => {
    setCustomMetrics(prev => [...prev, item]);
  };

  const handleDeleteCustomMetric = async (id: string) => {
    try {
      console.log('🗑️ 삭제 요청 metricId:', id);

      const response = await api.delete(`/health/metrics/${id}`);

      console.log('✅ 커스텀 건강지표 삭제 응답:', response.data);

      setCustomMetrics(prev => prev.filter(item => item.id !== id));
      setIsDeleteMode(false);
    } catch (error: any) {
      console.error(
        '❌ 커스텀 건강지표 삭제 실패:',
        error?.response?.data || error
      );
    }
  };

  

  return (
    <View style={styles.root}>
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
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.headerShadow} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <MyHealthMetricsSection
          customItems={customMetrics}
          isDeleteMode={isDeleteMode}
          isDeleteEnabled={hasCustomMetrics}
          onToggleDeleteMode={() => {
            if (!hasCustomMetrics) return;
            setIsDeleteMode(prev => !prev);
          }}
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
          onPressCustomItem={(item) => {
            stackNav.navigate('HealthMetric', {
              title: item.name,
              isCustom: true,
              customMetric: item,
            });
          }}
          onDeleteCustomItem={handleDeleteCustomMetric}
        />

        <CreateCustomMetricSection
          onCreateMetric={handleCreateCustomMetric}
        />
      </ScrollView>
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