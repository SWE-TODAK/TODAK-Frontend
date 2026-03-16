// src/components/common/ConfirmModal.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal } from 'react-native';

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
  const handleBackdropPress = onBackdropPress ?? onCancel;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel} // 안드로이드 물리적 뒤로가기 버튼 눌렀을 때 닫힘
    >
      <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
        <Pressable
          style={styles.card}
          onPress={(e) => e.stopPropagation()} // 모달 내부(하얀 창) 터치 시 닫히는 것 방지
        >
          <View style={styles.contentArea}>
            {!!title && <Text style={styles.title}>{title}</Text>}
            <Text style={styles.desc}>{message}</Text>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.divider} />
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnLeft]}
                onPress={onCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.btnTextCancel}>{cancelText}</Text>
              </TouchableOpacity>

              <View style={styles.vDivider} />

              <TouchableOpacity
                style={styles.btn}
                onPress={onConfirm}
                activeOpacity={0.8}
              >
                <Text style={[styles.btnTextConfirm, { color: confirmColor }]}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // absoluteContainer는 Modal이 화면 전체를 덮어주므로 더 이상 필요 없습니다.
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
    color: '#6B7280',
    lineHeight: 18,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  actions: {
    flexDirection: 'row',
    height: 48,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLeft: {
    // 필요 시 취소 버튼 전용 스타일 추가
  },
  vDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  btnTextCancel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  btnTextConfirm: {
    fontSize: 14,
    fontWeight: '700',
  },
});