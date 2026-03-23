import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import api from '../../../api/axios';

export type CustomHealthMetricItem = {
  id: string;
  name: string;
  unit: string;
};

type Props = {
  onCreateMetric: (item: CustomHealthMetricItem) => void;
};

const CreateCustomMetricSection: React.FC<Props> = ({ onCreateMetric }) => {
  const [metricName, setMetricName] = useState('');
  const [metricUnit, setMetricUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled =
    !metricName.trim() || !metricUnit.trim() || isSubmitting;

  const handleCreate = async () => {
    if (isDisabled) return;

    try {
      setIsSubmitting(true);

      const requestBody = {
        name: metricName.trim(),
        unit: metricUnit.trim(),
      };

      console.log('✅ 커스텀 건강지표 생성 요청 body:', requestBody);

      const response = await api.post('/health/metrics', requestBody);

      console.log('✅ 커스텀 건강지표 생성 응답:', response.data);

      const newMetric: CustomHealthMetricItem = {
        id: String(response.data.id),
        name: response.data.name,
        unit: response.data.unit,
      };

      onCreateMetric(newMetric);

      setMetricName('');
      setMetricUnit('');
      Alert.alert('완료', '건강지표가 생성되었어요.');
    } catch (error: any) {
      console.log('❌ status:', error?.response?.status);
      console.log('❌ data:', error?.response?.data);
      console.log('❌ full error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>나만의 건강지표 생성하기</Text>
      <Text style={styles.subtitle}>
        이름, 단위를 입력하면 나만의 건강지표를 만들 수 있어요
      </Text>

      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>지표 이름</Text>
          <TextInput
            value={metricName}
            onChangeText={setMetricName}
            placeholder=""
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>지표 단위</Text>
          <TextInput
            value={metricUnit}
            onChangeText={setMetricUnit}
            placeholder=""
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            editable={!isSubmitting}
          />
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleCreate}
        disabled={isDisabled}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? '생성 중...' : '생성하기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateCustomMetricSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#9CA3AF',
  },
  inputRow: {
    flexDirection: 'row',
    columnGap: 16,
    marginTop: 18,
  },
  inputBox: {
    flex: 1,
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  input: {
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
  },
  button: {
    marginTop: 20,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#2F62FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});