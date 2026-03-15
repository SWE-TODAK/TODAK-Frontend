// src/components/Health/chart-ui/MetricInputModal.tsx
import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

import { MetricInputFieldConfig } from '../types/healthMetric.types';

import DatePicker from 'react-native-date-picker';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  inputFields: MetricInputFieldConfig[];
  values: Record<string, string>;
  onChangeValue: (key: string, value: string) => void;
  onSubmit: () => void;
};

export default function MetricInputModal({
  visible,
  onClose,
  title,
  inputFields,
  values,
  onChangeValue,
  onSubmit,
}: Props) {
  const slide = useRef(new Animated.Value(0)).current;

  const [date, setDate] = React.useState(new Date());
  const [dateOpen, setDateOpen] = React.useState(false);

  const dateText = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;

  useEffect(() => {
    if (visible) {
      slide.setValue(0);
      Animated.timing(slide, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slide]);

  const translateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [260, 0],
  });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* 배경 눌러 닫기 */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
          style={styles.kav}
        >
          <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
            <View style={styles.grabber} />

            <Text style={styles.title}>{title}</Text>

            {/* 날짜/시간은 일단 UI만. 다음 단계에서 DatePicker 붙이면 됨 */}
            <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>날짜</Text>

                <Pressable style={styles.pill} onPress={() => setDateOpen(true)}>
                    <Text style={styles.pillText}>{dateText}</Text>
                </Pressable>
           </View>
           <DatePicker
                modal
                open={dateOpen}
                date={date}
                mode="date"
                onConfirm={(d) => {
                    setDateOpen(false);
                    setDate(d);
                }}
                onCancel={() => setDateOpen(false)}
                />
           <View style={styles.form}>
            {inputFields.map((field, index) => (
              <View key={field.key} style={styles.inputRow}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <TextInput
                  value={values[field.key] ?? ''}
                  onChangeText={(text) => onChangeValue(field.key, text)}
                  placeholder={field.placeholder ?? ''}
                  keyboardType={field.keyboardType ?? 'numeric'}
                  style={styles.input}
                  returnKeyType={index === inputFields.length - 1 ? 'done' : 'next'}
                />
                <Text style={styles.unit}>{field.unit ?? ''}</Text>
              </View>
            ))}
          </View>

            <Pressable style={styles.submitBtn} onPress={onSubmit}>
              <Text style={styles.submitText}>완료</Text>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    justifyContent: 'flex-end',
  },
  kav: {
    width: '100%',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLabel: {
    width: 46,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
  pill: {
    marginLeft: 'auto',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  pillText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  form: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  inputLabel: {
    minWidth: 88,
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF', // ✅ 흰색
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  unit: {
    marginLeft: 10,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
  submitBtn: {
    marginTop: 14,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(59,130,246,0.95)',
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});