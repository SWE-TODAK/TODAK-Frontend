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

type Props = NativeStackScreenProps<RootStackParamList, 'LocalLogin'>;

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); // 이메일 오류 판단 기준

export default function LocalLogin({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  const onContinue = () => {
    if (!canContinue) return;
    // ✅ 다음 스텝으로 연결 (일단 임시)
    // 나중에 "비밀번호 입력 화면" 만들면 그 라우트로 바꾸면 됨.
    navigation.navigate('LocalPassword'); // or navigation.navigate('ResetPasswordFlow') etc.
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
                <Text style={styles.errorText}>올바른 이메일을 입력해주세요</Text>
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