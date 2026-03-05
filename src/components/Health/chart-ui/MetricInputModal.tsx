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

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;

  // 혈압 2개 필드 (다른 지표는 다음 단계에서 확장)
  systolic: string;
  diastolic: string;
  onChangeSystolic: (v: string) => void;
  onChangeDiastolic: (v: string) => void;

  onSubmit: () => void;
};

export default function MetricInputModal({
  visible,
  onClose,
  title,
  systolic,
  diastolic,
  onChangeSystolic,
  onChangeDiastolic,
  onSubmit,
}: Props) {
  const slide = useRef(new Animated.Value(0)).current;

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
              <View style={styles.pill}>
                <Text style={styles.pillText}>2026. 3. 5.</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>시간</Text>
              <View style={styles.pill}>
                <Text style={styles.pillText}>23:11</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>수축</Text>
                <TextInput
                  value={systolic}
                  onChangeText={onChangeSystolic}
                  placeholder="예: 120"
                  keyboardType="number-pad"
                  style={styles.input}
                  returnKeyType="next"
                />
                <Text style={styles.unit}>mmHg</Text>
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>이완</Text>
                <TextInput
                  value={diastolic}
                  onChangeText={onChangeDiastolic}
                  placeholder="예: 80"
                  keyboardType="number-pad"
                  style={styles.input}
                  returnKeyType="done"
                />
                <Text style={styles.unit}>mmHg</Text>
              </View>
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
    backgroundColor: '#0B0F16',
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
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    color: '#FFFFFF',
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
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    fontWeight: '700',
  },
  pill: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  pillText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '700',
  },
  form: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  inputLabel: {
    width: 44,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    fontWeight: '800',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  unit: {
    marginLeft: 10,
    color: 'rgba(255,255,255,0.65)',
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