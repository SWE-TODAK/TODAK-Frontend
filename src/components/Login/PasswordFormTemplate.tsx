// src/components/Login/PasswordFormTemplate.tsx
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

const isValidPassword = (v: string) => v.trim().length >= 8;

export type PasswordSubmitData = {
  currentPassword?: string;
  newPassword: string;
  newPasswordConfirm: string;
};

type Props = {
  title?: string;
  requireCurrentPassword?: boolean; // true면 '현재 비밀번호' 칸 노출
  serverError?: string | null;      // 부모에서 내려주는 서버 에러 메시지
  isSubmitting?: boolean;           // 로딩 상태
  onBack: () => void;
  onSubmit: (data: PasswordSubmitData) => void;
  onClearError?: () => void;        // 타이핑 시 에러 초기화 함수
};

export default function PasswordFormTemplate({
  title = '비밀번호 변경',
  requireCurrentPassword = false,
  serverError,
  isSubmitting = false,
  onBack,
  onSubmit,
  onClearError,
}: Props) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 필요시 토글 추가 가능
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const tCurrent = currentPw.trim();
  const tNew = newPw.trim();
  const tConfirm = confirmPw.trim();

  const isCurrentPwOk = requireCurrentPassword ? tCurrent.length > 0 : true;
  const isNewPwOk = useMemo(() => isValidPassword(tNew), [tNew]);
  const isMatchOk = useMemo(() => tNew.length > 0 && tNew === tConfirm, [tNew, tConfirm]);

  const canContinue = isCurrentPwOk && isNewPwOk && isMatchOk && !isSubmitting;

  // 타이핑 시 부모의 서버 에러 초기화
  useEffect(() => {
    if (serverError && onClearError) onClearError();
  }, [tCurrent, tNew, tConfirm]);

  const handleSubmit = () => {
    if (!canContinue) return;
    onSubmit({
      currentPassword: requireCurrentPassword ? tCurrent : undefined,
      newPassword: tNew,
      newPasswordConfirm: tConfirm,
    });
  };

  const showNewPwError = tNew.length > 0 && !isNewPwOk;
  const showNewPwSuccess = tNew.length > 0 && isNewPwOk;
  const showConfirmError = tConfirm.length > 0 && isNewPwOk && !isMatchOk;
  const showConfirmSuccess = tConfirm.length > 0 && isNewPwOk && isMatchOk;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* 헤더 */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onBack} activeOpacity={0.8} style={styles.backCircle}>
                <Image source={require('../../assets/icons/back.png')} style={styles.backImage} resizeMode="contain" />
              </TouchableOpacity>
              <Text style={styles.title}>{title}</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.form}>
              {/* 조건부: 현재 비밀번호 */}
              {requireCurrentPassword && (
                <>
                  <Text style={styles.sectionTitle}>현재 비밀번호 입력</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      value={currentPw} onChangeText={setCurrentPw}
                      placeholder="현재 비밀번호를 입력해 주세요" placeholderTextColor="rgba(60, 60, 67, 0.3)"
                      secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} style={styles.input}
                    />
                    {!!tCurrent && (
                      <TouchableOpacity onPress={() => setCurrentPw('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.clearBtn}>
                        <Image source={require('../../assets/icons/Clear.png')} style={styles.clearImage} resizeMode="contain" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.underline} />
                  <View style={{ height: 34 }} />
                </>
              )}

              {/* 새 비밀번호 */}
              <Text style={styles.sectionTitle}>새로운 비밀번호 입력</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={newPw} onChangeText={setNewPw}
                  placeholder="8자리 이상 비밀번호를 입력해 주세요" placeholderTextColor="rgba(60, 60, 67, 0.3)"
                  secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} style={styles.input}
                />
                {!!tNew && (
                  <TouchableOpacity onPress={() => setNewPw('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.clearBtn}>
                    <Image source={require('../../assets/icons/Clear.png')} style={styles.clearImage} resizeMode="contain" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.underline} />
              {showNewPwError && <Text style={styles.errorText}>8자리 이상 입력해주세요</Text>}
              {showNewPwSuccess && <Text style={styles.successText}>올바른 비밀번호입니다</Text>}

              {/* 새 비밀번호 확인 */}
              <Text style={[styles.sectionTitle, { marginTop: 34 }]}>새로운 비밀번호 확인</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={confirmPw} onChangeText={setConfirmPw}
                  placeholder="비밀번호를 다시 입력해 주세요" placeholderTextColor="rgba(60, 60, 67, 0.3)"
                  secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} style={styles.input}
                />
                {!!tConfirm && (
                  <TouchableOpacity onPress={() => setConfirmPw('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.clearBtn}>
                    <Image source={require('../../assets/icons/Clear.png')} style={styles.clearImage} resizeMode="contain" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.underline} />
              {showConfirmError && <Text style={styles.errorText}>비밀번호가 다릅니다</Text>}
              {showConfirmSuccess && <Text style={styles.successText}>비밀번호가 일치합니다</Text>}

              {/* 서버 에러 */}
              {serverError && <Text style={[styles.errorText, { marginTop: 24, fontSize: 14 }]}>{serverError}</Text>}
            </View>

            {/* 하단 버튼 */}
            <View style={[styles.bottomArea, { marginBottom: keyboardHeight ? keyboardHeight : 0 }]}>
              <TouchableOpacity style={styles.continueButton} onPress={handleSubmit} activeOpacity={0.8} disabled={!canContinue}>
                <Image
                  source={canContinue ? require('../../assets/icons/continue-active.png') : require('../../assets/icons/continue-inactive.png')}
                  style={styles.continueImage} resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#ffffff' },
  inner: { flex: 1, paddingHorizontal: 24 },
  header: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30 },
  backCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  backImage: { width: 20, height: 20 },
  title: { color: '#333333', fontSize: 17, fontWeight: '600' },
  form: { marginTop: 40 }, // 기존 80에서 조절 (현재비밀번호 공간 확보용)
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#000000', marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, color: '#5A5A5A', fontSize: 17, fontWeight: '500', paddingVertical: 10 },
  clearBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  clearImage: { width: 20, height: 20 },
  underline: { height: 1, backgroundColor: '#E6E6E6', marginTop: 10 },
  errorText: { marginTop: 8, color: '#FF0000', fontSize: 12, fontWeight: '500' },
  successText: { marginTop: 8, color: '#1E8E3E', fontSize: 12, fontWeight: '500' },
  bottomArea: { alignItems: 'center', paddingBottom: 50, marginTop: 'auto' },
  continueButton: { width: '100%', height: 52, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  continueImage: { width: '100%', height: '100%' },
});