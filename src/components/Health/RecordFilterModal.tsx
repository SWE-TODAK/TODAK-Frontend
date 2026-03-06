import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';

type Props = {
  visible: boolean;
  value: string;
  onChangeValue: (v: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function RecordFilterModal({
  visible,
  value,
  onChangeValue,
  onClose,
  onConfirm,
}: Props) {
  const [initialValue, setInitialValue] = useState(value);

  useEffect(() => {
    if (visible) {
      setInitialValue(value);
    }
  }, [visible]);

  const isChanged = useMemo(() => {
    return value !== initialValue;
  }, [value, initialValue]);

  const handleSliderChange = (v: number) => {
    onChangeValue(String(v));
  };

  const handleInputChange = (text: string) => {
    const onlyNumber = text.replace(/[^0-9]/g, '');

    if (onlyNumber === '') {
      onChangeValue('');
      return;
    }

    const num = Number(onlyNumber);

    if (num < 1) {
      onChangeValue('1');
      return;
    }

    if (num > 60) {
      onChangeValue('60');
      return;
    }

    onChangeValue(String(num));
  };

  const handleConfirm = () => {
    if (!isChanged) return;
    onConfirm();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.topRow}>
            <Pressable onPress={onClose} hitSlop={8} style={styles.iconButton}>
              <Image
                source={require('../../assets/icons/Clear.png')}
                style={styles.sideIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable
              onPress={handleConfirm}
              hitSlop={8}
              style={styles.iconButton}
              disabled={!isChanged}
            >
              <Image
                source={
                  isChanged
                    ? require('../../assets/icons/blue-check.png')
                    : require('../../assets/icons/gray-check.png')
                }
                style={styles.sideIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <Text style={styles.title}>사용자 설정</Text>
          <Text style={styles.subTitle}>표시할 최근 기록의 개수를 설정해 주세요</Text>

          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={60}
            step={1}
            value={Number(value) || 1}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#2563EB"
            maximumTrackTintColor="#D1D5DB"
            thumbTintColor="#2563EB"
          />

          <View style={styles.inputRow}>
            <Text style={styles.label}>개수 선택</Text>
            <TextInput
              value={value}
              onChangeText={handleInputChange}
              keyboardType="number-pad"
              style={styles.input}
              maxLength={2}
              textAlignVertical="center"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 24, 39, 0.18)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 99,
    backgroundColor: '#D1D5DB',
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideIcon: {
    width: 24,
    height: 24,
  },
  title: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  subTitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 20,
  },
  inputRow: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginRight: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  input: {
    width: 112,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    paddingVertical: 0,
    includeFontPadding: false,
    lineHeight: 22,
  },
});