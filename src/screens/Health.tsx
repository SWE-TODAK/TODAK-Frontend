// src/screens/Health.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,        // ✅ 추가
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { MainTabParamList } from '../navigation/MainTabNavigator';
import HealthMetricTabs, {
  HealthMetricType,
} from '../components/Health/HealthMetricTabs';
import HealthMetricSection from '../components/Health/HealthMetricSection';
import HealthMetricComment from '../components/Health/HealthMetricComment';

type HealthScreenNavProp = BottomTabNavigationProp<
  MainTabParamList,
  'Health'
>;

type MetricPoint = {
  dateLabel: string;
  value: number;
};

const Health: React.FC = () => {
  const navigation = useNavigation<HealthScreenNavProp>();
  const insets = useSafeAreaInsets();

  const [selectedMetric, setSelectedMetric] =
    useState<HealthMetricType>('bloodPressure');

  // ✅ 각 지표별 데이터 state (초기값 전부 빈 배열)
  const [bpData, setBpData] = useState<MetricPoint[]>([]);
  const [sugarData, setSugarData] = useState<MetricPoint[]>([]);
  const [liverData, setLiverData] = useState<MetricPoint[]>([]);

  // ✅ 입력값 state
  const [dateInput, setDateInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  // ✅ 현재 선택된 지표에 맞는 데이터
  const metricData: MetricPoint[] =
    selectedMetric === 'bloodPressure'
      ? bpData
      : selectedMetric === 'bloodSugar'
      ? sugarData
      : liverData;

  // ✅ 값 추가 버튼
  const handleAddMetric = () => {
    const trimmedDate = dateInput.trim();
    const trimmedValue = valueInput.trim();

    if (!trimmedDate || !trimmedValue) {
      Alert.alert('입력 필요', '날짜와 값을 모두 입력해주세요.');
      return;
    }

    const numericValue = Number(trimmedValue);
    if (Number.isNaN(numericValue)) {
      Alert.alert('입력 오류', '값에는 숫자만 입력할 수 있어요.');
      return;
    }

    const newItem: MetricPoint = {
      dateLabel: trimmedDate,
      value: numericValue,
    };

    if (selectedMetric === 'bloodPressure') {
      setBpData(prev => [...prev, newItem]);
    } else if (selectedMetric === 'bloodSugar') {
      setSugarData(prev => [...prev, newItem]);
    } else {
      setLiverData(prev => [...prev, newItem]);
    }

    setDateInput('');
    setValueInput('');
  };

  return (
    <View style={styles.root}>
      {/* 🔼 상태바 높이만큼 흰색으로 덮기 */}
      <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />

      {/* 🔹 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')} // ← 메인(Home)으로 이동
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 혈당 / 혈압 / 간수치 탭 */}
          <HealthMetricTabs
            selected={selectedMetric}
            onChange={setSelectedMetric}
          />

          {/* 🔹 입력 영역 */}
          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>날짜</Text>
              <TextInput
                style={styles.input}
                placeholder="10.30"
                placeholderTextColor="#9CA3AF"
                value={dateInput}
                onChangeText={setDateInput}
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>값</Text>
              <TextInput
                style={styles.input}
                placeholder="120"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={valueInput}
                onChangeText={setValueInput}
              />
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMetric}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          </View>

          {/* 선택된 지표 섹션 (제목 + 상태 + 문구 + 그래프) */}
          <HealthMetricSection metric={selectedMetric} data={metricData} />
          <HealthMetricComment metric={selectedMetric} data={metricData} />
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 24, // 🔹 마지막 요소가 살짝 위에 보이도록 여유
  },

  // 🔹 입력 영역 스타일
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    columnGap: 8,
  },
  inputBox: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#6B7280',
    paddingTop:2,
    marginLeft:5,
    marginBottom: 4,
  },
  input: {
    height: 38,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#111827',
  },
  addButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3059FF',
    marginLeft: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
