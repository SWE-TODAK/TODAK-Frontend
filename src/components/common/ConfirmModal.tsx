import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

type Props = {
  visible: boolean;
  title?: string;          // 위에 작은 제목(선택)
  message: string;         // 본문
  cancelText?: string;     // 기본: 취소
  confirmText?: string;    // 기본: 확인
  confirmColor?: string;   // 기본: 파랑(#3B82F6), 위험이면 빨강 등
  onCancel: () => void;
  onConfirm: () => void;
  onBackdropPress?: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  cancelText = '취소',
  confirmText = '확인',
  confirmColor = '#3B82F6',
  onCancel,
  onConfirm,
  onBackdropPress,
}: Props) {
  if (!visible) return null;

  const handleBackdropPress = onBackdropPress ?? onCancel;

  return (
    <View style={styles.absoluteContainer}>
      <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
        <Pressable
          style={styles.card}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.contentArea}>
            {!!title && <Text style={styles.title}>{title}</Text>}
            <Text style={styles.desc}>{message}</Text>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.divider} />
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={onCancel}>
                <Text style={styles.btnTextCancel}>{cancelText}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={onConfirm}>
                <Text style={[styles.btnTextConfirm, { color: confirmColor }]}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: 320,
    height: 168,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  contentArea: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  desc: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
  },
  divider: { height: 1, backgroundColor: '#E6E6E6' },
  actions: { flexDirection: 'row', height: 44 },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnTextCancel: { fontSize: 12, fontWeight: '600', color: '#666666' },
  btnTextConfirm: { fontSize: 12, fontWeight: '700' },
});