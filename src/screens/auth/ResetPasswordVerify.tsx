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
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPasswordFlow'>;

const isValidCode = (v: string) => /^\d{6}$/.test(v.trim());

export default function ResetPasswordFlow({ navigation, route }: Props) {
  // ✅ params가 잠깐 undefined여도 훅 순서 깨지지 않게 기본값
  const email = route.params?.email ?? '';

  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

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

  const trimmedCode = code.trim();
  const isCodeFormatOk = useMemo(() => isValidCode(trimmedCode), [trimmedCode]);

  useEffect(() => {
    // 입력이 바뀌면 검증 상태 초기화
    if (isVerified) setIsVerified(false);
    if (verifyError) setVerifyError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmedCode]);

  const canVerify = isCodeFormatOk && !isVerifying;
  const canContinue = isVerified && !isVerifying;
  const showClear = trimmedCode.length > 0;

  const onVerify = async () => {
    setTouched(true);
    if (!canVerify) return;

    setIsVerifying(true);
    setVerifyError(null);

    try {
      // TODO: axios로 서버 검증
      await new Promise((r) => setTimeout(r, 600));
      const ok = trimmedCode === '123456';
      if (!ok) throw new Error('INVALID_CODE');

      setIsVerified(true);
    } catch {
      setIsVerified(false);
      setVerifyError('인증번호가 올바르지 않아요');
    } finally {
      setIsVerifying(false);
    }
  };

  const onContinue = () => {
    if (!canContinue) return;
    navigation.navigate('ResetPasswordNewPw', { email, code: trimmedCode });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
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

              <Text style={styles.title}>이메일 인증</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.form}>
              <Text style={styles.guideText}>
                {email} 으로{'\n'}인증번호가 전송되었습니다
              </Text>

              <View style={styles.inputRow}>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  onBlur={() => setTouched(true)}
                  placeholder="6자리 인증번호를 입력해 주세요"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                  keyboardType="number-pad"
                  maxLength={6}
                  style={styles.input}
                />

                {showClear && (
                  <TouchableOpacity
                    onPress={() => setCode('')}
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

                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!canVerify}
                  onPress={onVerify}
                >
                  <Image
                    source={
                      canVerify
                        ? require('../../assets/icons/verification-active.png')
                        : require('../../assets/icons/verification-inactive.png')
                    }
                    style={styles.verifyImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.underline} />

              {touched && trimmedCode.length > 0 && !isCodeFormatOk && (
                <Text style={styles.errorText}>인증번호 6자리를 정확히 입력해주세요</Text>
              )}
              {verifyError && <Text style={styles.errorText}>{verifyError}</Text>}
              {isVerified && !verifyError && (
                <Text style={styles.successText}>인증이 완료되었어요</Text>
              )}
            </View>

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
  backImage: { width: 20, height: 20 },
  title: { color: '#333333', fontSize: 17, fontWeight: '600' },

  form: { marginTop: 100 },
  guideText: { fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 20 },

  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    color: '#5A5A5A',
    fontSize: 17,
    fontWeight: '500',
    paddingVertical: 10,
    marginRight: 12,
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  clearImage: { width: 20, height: 20 },

  verifyImage: { width: 45, height: 32 },
  underline: { height: 2, backgroundColor: '#E6E6E6', marginTop: 8 },

  errorText: { marginTop: 16, color: '#FF0000', fontSize: 12, fontWeight: '500' },
  successText: { marginTop: 16, color: '#1E8E3E', fontSize: 12, fontWeight: '600' },

  bottomArea: { alignItems: 'center', paddingBottom: 50, marginTop: 'auto' },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueImage: { width: '100%', height: '100%' },
});