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

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPasswordNewPw'>;

const isValidPassword = (v: string) => v.trim().length >= 6;

export default function ResetPasswordNewPw({ navigation, route }: Props) {
  const email = route.params?.email ?? '';
  const code = route.params?.code ?? '';

  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

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

  const t1 = pw1.trim();
  const t2 = pw2.trim();

  const pwOk = useMemo(() => isValidPassword(t1), [t1]);
  const matchOk = useMemo(() => t1.length > 0 && t1 === t2, [t1, t2]);

  const canContinue = pwOk && matchOk && !isSubmitting;

  // 입력 변경 시 에러 초기화
  useEffect(() => {
    if (error) setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t1, t2]);

  const onContinue = async () => {
    if (!canContinue) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // ✅ TODO: 서버 요청 (예: /auth/password/reset)
      // await axios.post('/auth/password/reset', { email, code, newPassword: t1 });

      // ---- MOCK ----
      await new Promise((r) => setTimeout(r, 600));

      // ✅ 성공 시: 로그인으로 보내거나, 비밀번호 변경 완료 화면으로
      navigation.replace('ResetPasswordSuccess', { email });
    } catch (e: any) {
      setError('비밀번호 변경에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
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

              <Text style={styles.title}>비밀번호 변경</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.form}>
              {/* 새 비밀번호 */}
              <Text style={styles.sectionTitle}>새로운 비밀번호 입력</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={pw1}
                  onChangeText={setPw1}
                  placeholder="6자리 이상 비밀번호를 입력해 주세요"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />

                {!!t1 && (
                  <TouchableOpacity
                    onPress={() => setPw1('')}
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

              {/* 비밀번호 확인 */}
              <Text style={[styles.sectionTitle, { marginTop: 34 }]}>
                새로운 비밀번호 확인
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={pw2}
                  onChangeText={setPw2}
                  placeholder="비밀번호를 다시 입력해 주세요"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />

                {!!t2 && (
                  <TouchableOpacity
                    onPress={() => setPw2('')}
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

              {/* 에러 문구 (사진엔 없지만 필요하면 유지) */}
              {t1.length > 0 && !pwOk && (
                <Text style={styles.errorText}>비밀번호는 6자리 이상이어야 해요</Text>
              )}
              {t2.length > 0 && pwOk && !matchOk && (
                <Text style={styles.errorText}>비밀번호가 일치하지 않아요</Text>
              )}
              {error && <Text style={styles.errorText}>{error}</Text>}
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

  form: { marginTop: 80 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },

  inputRow: { flexDirection: 'row', alignItems: 'center' },
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
  clearImage: { width: 20, height: 20 },

  underline: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginTop: 10,
  },

  errorText: {
    marginTop: 14,
    color: '#FF0000',
    fontSize: 12,
    fontWeight: '500',
  },

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