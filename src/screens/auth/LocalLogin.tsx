import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';

import { publicApi } from '../../api/axios';
import { startKakaoLogin } from '../../utils/kakaoAuth';
import ConfirmModal from '../../components/common/ConfirmModal';
import Toast from '../../components/common/Toast';

type Props = NativeStackScreenProps<RootStackParamList, 'LocalLogin'>;

const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function LocalLogin({ navigation, route }: Props) {
  // ✅ (선택) SignUpSuccess에서 email을 넘겼으면 기본값으로 깔아주기
  const initialEmail = route.params?.email ?? '';

  const [email, setEmail] = useState(initialEmail);
  const [touched, setTouched] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // ✅ mode: 'login'이면 LocalPassword, 그 외는 SignUpPassword
  const mode = route.params?.mode ?? 'signup';

  // 모달 상태 관리 (카카오 로그인 및 복구/전환 선택용)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    confirmText: '확인',
    cancelText: '취소',
    onConfirm: () => {},
    onCancel: () => {},
  });

  // 토스트 상태 관리 (단순 알림용)
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const trimmed = email.trim();
  const canContinue = useMemo(() => isValidEmail(trimmed), [trimmed]);
  const showError = touched && trimmed.length > 0 && !canContinue;
  const showClear = trimmed.length > 0;

  const onContinue = async () => {
    if (!canContinue) return;

    try {
      // 1. 이메일 상태 조회
      const res = await publicApi.get('/auth/account-status', {
        params: { email: trimmed },
      });
      const { accountStatus } = res.data;

      // 2. accountStatus 기준에 따른 동작 분기
      switch (accountStatus) {
        case 'ACTIVE_LOCAL':
          // 활성 LOCAL 계정 → LOCAL 로그인 (비밀번호 입력 창)
          navigation.navigate('LocalPassword', { email: trimmed });
          break;

        case 'ACTIVE_KAKAO':
          // 활성 KAKAO 계정 → KAKAO 로그인 유도 (사용자 확인 필요)
          setModalConfig({
            title: '카카오 로그인',
            message: '해당 이메일은 카카오로 가입된 계정입니다.\n카카오 로그인을 진행해주세요.',
            confirmText: '카카오로 로그인',
            cancelText: '취소',
            onConfirm: () => {
              setModalVisible(false);
              startKakaoLogin();
            },
            onCancel: () => setModalVisible(false),
          });
          setModalVisible(true);
          break;

        case 'NEW_USER':
        case 'DELETED_LOCAL':
          // 신규 유저 또는 탈퇴한 LOCAL 계정 → LOCAL 회원가입/복구 진행
          navigation.navigate('SignUpPassword', { email: trimmed });
          break;

        case 'DELETED_KAKAO':
          // 탈퇴한 KAKAO 계정 → 복구(카카오) 또는 전환(로컬) 선택 (사용자 확인 필요)
          setModalConfig({
            title: '탈퇴한 카카오 계정 안내',
            message: '카카오 로그인을 통해 계정을 복구하시거나\n이메일 로그인으로 전환하실 수 있습니다.',
            confirmText: '카카오로 복구',
            cancelText: '이메일로 전환',
            onConfirm: () => {
              setModalVisible(false);
              startKakaoLogin();
            },
            onCancel: () => {
              setModalVisible(false);
              navigation.navigate('SignUpPassword', { email: trimmed });
            },
          });
          setModalVisible(true);
          break;

        default:
          // 그 외 알 수 없는 상태는 Toast로 가볍게 처리
          showToast('계정 상태를 확인할 수 없습니다.');
      }
    } catch (error) {
      console.log('이메일 상태 조회 실패:', error);
      // 통신 실패와 같은 에러는 Toast로 가볍게 처리
      showToast('계정 상태를 조회하는 데 실패했습니다.\n잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* 헤더 */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                style={styles.backCircle}
              >
                <Image
                  source={require('../../assets/icons/back.png')}
                  style={styles.backImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Text style={styles.title}>이메일로 시작하기</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.form}>
              <Text style={styles.guideText}>이메일 주소를 입력해 주세요</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={email}
                  onChangeText={(v) => setEmail(v)}
                  onBlur={() => setTouched(true)}
                  placeholder="ex) todak@gmail.com"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />

                {showClear && (
                  <TouchableOpacity
                    onPress={() => setEmail('')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.clearBtn}
                  >
                    <Image
                      source={require('../../assets/icons/Clear.png')}
                      style={styles.clearImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.underline} />

              {showError && (
                <Text style={styles.errorText}>
                  올바른 이메일을 입력해주세요
                </Text>
              )}
            </View>

            {/* 하단 버튼 */}
            <View
              style={[
                styles.bottomArea,
                { marginBottom: keyboardHeight ? keyboardHeight : 0 },
              ]}
            >
              <TouchableOpacity
                style={styles.continueButton}
                onPress={onContinue}
                activeOpacity={0.8}
                disabled={!canContinue}
              >
                <Image
                  source={
                    canContinue
                      ? require('../../assets/icons/continue-active.png')
                      : require('../../assets/icons/continue-inactive.png')
                  }
                  style={styles.continueImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <ConfirmModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
      />

      <Toast visible={toastVisible} message={toastMessage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#ffffff' },
  inner: { flex: 1, paddingHorizontal: 24 },

  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImage: {
    width: 20,
    height: 20,
  },
  title: {
    color: '#333333',
    fontSize: 17,
    fontWeight: '600',
  },

  form: {
    marginTop: 100, // 피그마처럼 위쪽 여백
  },
  guideText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#5A5A5A',
    fontSize: 17,
    fontWeight: '500',
    paddingVertical: 10,
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  clearImage: {
    width: 20,
    height: 20,
  },
  underline: {
    height: 2,
    backgroundColor: '#E6E6E6',
    marginTop: 8,
  },
  errorText: {
    marginTop: 16,
    color: '#FF0000',
    fontSize: 12,
    fontWeight: '500',
  },

  bottomArea: {
    alignItems: 'center',
    paddingBottom: 50,
    marginTop: 'auto',
  },

  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueImage: {
    width: '100%',
    height: '100%',
  },
});