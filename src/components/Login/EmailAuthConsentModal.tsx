import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Dimensions } from 'react-native';

type Props = {
  visible: boolean;
  email: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function EmailAuthConsentModal({
  visible,
  email,
  onCancel,
  onConfirm,
}: Props) {
  if (!visible) return null;

  return (
    <View style={styles.absoluteContainer}>
      <Pressable style={styles.backdrop} onPress={onCancel}>

        <Pressable
          style={styles.card}
          onPress={(e) => e.stopPropagation()}
          activeOpacity={1}
        >
          {/* ✅ 텍스트 영역 (상단 여백 등은 여기서 조절) */}
          <View style={styles.contentArea}>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.desc}>
              비밀번호 변경을 위한 인증번호를 보내드릴까요?
            </Text>
          </View>

          {/* ✅ [수정] 하단 고정 영역 (Divider + Buttons) */}
          {/* 이 뷰를 absolute로 띄워서 바닥에 붙입니다 */}
          <View style={styles.bottomSection}>
            <View style={styles.divider} />
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={onCancel}
              >
                <Text style={styles.btnTextCancel}>아니오</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={onConfirm}
              >
                <Text style={styles.btnTextConfirm}>네</Text>
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
    // 카드의 크기 설정
    width: 320,
    height: 168,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    // 내부 레이아웃
    // position relative가 기본값이므로 자식의 absolute는 이 카드를 기준으로 잡힘
  },

  // ✅ 텍스트 컨텐츠 영역 (위치 잡기용)
  contentArea: {
    alignItems: 'center',
    marginTop: 40, // 텍스트 시작 위치 조절
  },
  email: {
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

  // ✅ [핵심] 하단 고정 컨테이너 스타일
  bottomSection: {
    position: 'absolute', // 1. 공중에 띄움
    bottom: 0,            // 2. 바닥에 붙임
    left: 0,              // 3. 좌우 꽉 채움
    right: 0,
    height: 45,           // 4. 높이 지정 (divider 1 + actions 44)
  },

  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
  },
  actions: {
    flexDirection: 'row',
    height: 44,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextCancel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  btnTextConfirm: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
});