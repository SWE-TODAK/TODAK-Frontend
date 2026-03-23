// src/components/Setting/WithdrawModal.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

interface WithdrawModalProps {
  visible: boolean;
  provider: 'LOCAL' | 'KAKAO';
  password?: string;
  setPassword?: (val: string) => void;
  errorText?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WithdrawModal({
  visible,
  provider,
  password,
  setPassword,
  errorText,
  onClose,
  onConfirm,
}: WithdrawModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.contentArea}>
            <Text style={styles.title}>회원탈퇴</Text>

            {provider === 'KAKAO' ? (
              <Text style={styles.desc}>
                정말 탈퇴하시겠습니까?{'\n'}회원탈퇴 시 카카오 계정 연결도 함께 해제됩니다.
              </Text>
            ) : (
              <>
                <Text style={styles.desc}>
                  회원탈퇴를 위해 비밀번호를 다시 입력해주세요.
                </Text>
                <TextInput
                  style={[styles.input, errorText && styles.inputError]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호 입력"
                  secureTextEntry
                  autoCapitalize="none"
                />
                {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}
              </>
            )}
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.divider} />
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btn}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.btnTextCancel}>취소</Text>
              </TouchableOpacity>

              <View style={styles.vDivider} />

              <TouchableOpacity
                style={styles.btn}
                onPress={onConfirm}
                activeOpacity={0.8}
              >
                <Text style={[styles.btnTextConfirm, { color: '#EF4444' }]}>탈퇴</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: 320,
    // 입력창이 들어갈 수 있도록 유연한 높이 설정 (ConfirmModal 기본 디자인 유지)
    minHeight: 180,
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
    marginTop: 24,
    paddingHorizontal: 20,
    // 하단 버튼 영역과 겹치지 않게 여백 확보
    paddingBottom: 60,
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
    marginBottom: 16, // 입력창과의 간격
  },
  input: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    alignSelf: 'flex-start',
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 2,
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