import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

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

  const isDisabled = !metricName.trim() || !metricUnit.trim();

  const handleCreate = () => {
    if (isDisabled) return;

    const newMetric: CustomHealthMetricItem = {
      id: `custom-${Date.now()}`,
      name: metricName.trim(),
      unit: metricUnit.trim(),
    };

    onCreateMetric(newMetric);

    setMetricName('');
    setMetricUnit('');
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
          />
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleCreate}
      >
        <Text style={styles.buttonText}>생성하기</Text>
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