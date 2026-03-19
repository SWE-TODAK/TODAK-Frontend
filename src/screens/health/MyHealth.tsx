// src/screens/Health.tsx
import React, { useState } from 'react';
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

type HealthScreenNavProp = BottomTabNavigationProp<MainTabParamList, 'MyHealth'>;

type HealthNavProp = NativeStackNavigationProp<
  HealthStackParamList,
  'HealthHome'
>;

const MyHealth: React.FC = () => {
  const tabNav = useNavigation<HealthScreenNavProp>();
  const stackNav = useNavigation<HealthNavProp>();
  const insets = useSafeAreaInsets();

  const [customMetrics, setCustomMetrics] = useState<CustomHealthMetricItem[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const handleCreateCustomMetric = (item: CustomHealthMetricItem) => {
    setCustomMetrics(prev => [...prev, item]);
  };

  const handleDeleteCustomMetric = (id: string) => {
    setCustomMetrics(prev => prev.filter(item => item.id !== id));
  }

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
          onToggleDeleteMode={() => setIsDeleteMode(prev => !prev)}
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