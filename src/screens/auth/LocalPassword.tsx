import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import EmailAuthConsentModal from '../../components/Login/EmailAuthConsentModal';

type Props = NativeStackScreenProps<RootStackParamList, 'LocalPassword'>;

const isValidPassword = (v: string) => v.trim().length >= 6;

export default function LocalPassword({ navigation, route }: Props) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [consentVisible, setConsentVisible] = useState(false);

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
  const email = route.params.email;
  const trimmed = password.trim();
  const canContinue = useMemo(() => isValidPassword(trimmed), [trimmed]);
  const showClear = trimmed.length > 0;
  const onChangePassword = (v: string) => {
    setPassword(v);
    if (loginError) setLoginError(null);
  };

  const onContinue = async () => {
    if (!canContinue || isSubmitting) return;

    setIsSubmitting(true);
    setLoginError(null);

    try {
      // ✅ TODO: 나중에 axios로 교체
      // await axios.post('/auth/login', { email, password: trimmed });

      // ---- MOCK 실패 예시 ----
      await new Promise((r) => setTimeout(r, 600));
      const ok = trimmed === '123456'; // 임시 성공 조건
      if (!ok) {
        throw new Error('INVALID_PASSWORD');
      }

      // ✅ 성공: MainTabs or MainScreen 이동
      navigation.replace('MainTabs');
    } catch (e: any) {
      // 실패 UX
      setLoginError('비밀번호가 올바르지 않아요');
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

              <Text style={styles.title}>로그인</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.form}>
              <Text style={styles.guideText}>비밀번호를 입력해 주세요</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={password}
                  onChangeText={onChangePassword}
                  placeholder="6자리 이상 비밀번호를 입력해 주세요"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />

                {showClear && (
                  <TouchableOpacity
                    onPress={() => setPassword('')}
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

              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.checkRow}
                  activeOpacity={0.8}
                  onPress={() => setShowPassword((p) => !p)}
                >
                  <Image
                      source={
                        showPassword
                          ? require('../../assets/icons/Checkbox-checked.png')
                          : require('../../assets/icons/Checkbox-unchecked.png')
                      }
                      style={styles.checkboxImage}
                      resizeMode="contain"
                    />
                  <Text style={styles.checkText}>비밀번호 보기</Text>
                </TouchableOpacity>
              </View>
              {loginError && (
                <Text style={styles.errorText}>{loginError}</Text>
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
                activeOpacity={0.8}
                style={styles.findPwWrap}
                onPress={() => {
                  setConsentVisible(true);
                }}
              >
                <Text style={styles.findPwText}>비밀번호 찾기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={onContinue}
                activeOpacity={0.8}
                disabled={!canContinue}
              >
                <Image
                  source={
                    canContinue
                      ? require('../../assets/icons/LoginButton-active.png')
                      : require('../../assets/icons/LoginButton-inactive.png')
                  }
                  style={styles.continueImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
       </TouchableWithoutFeedback>
       </View>
       <EmailAuthConsentModal
                    visible={consentVisible}
                    email={email}
                    onCancel={() => {
                        setConsentVisible(false);
                    }}
                    onConfirm={() => {
                      setConsentVisible(false);
                      navigation.navigate('ResetPasswordVerify', { email });
                    }}
                />
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
  optionsRow: {
    marginTop: 16,
    alignItems: 'flex-start',
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxImage: {
    width: 16,
    height: 16,
    marginRight: 15,
  },
  checkText: {
    fontSize: 16,
    color: '#1E1E1E',
    fontWeight: '500',
  },

  bottomArea: {
    alignItems: 'center',
    paddingBottom: 50,
    marginTop: 'auto',
  },
  findPwWrap: {
    marginBottom: 14,
  },

  findPwText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    textDecorationLine: 'underline',
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