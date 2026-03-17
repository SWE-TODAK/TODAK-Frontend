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
  Alert
} from 'react-native';
import { publicApi }from '../../api/axios';
import { saveAccessToken, saveRefreshToken, saveUser } from '../../utils/authStorage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpBirth'>;

// YYYYMMDD 8자리 + 간단한 날짜 유효성 체크
const isValidBirth = (v: string) => {
  const s = v.trim();
  if (!/^\d{8}$/.test(s)) return false;

  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(4, 6));
  const d = Number(s.slice(6, 8));

  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12) return false;

  const daysInMonth = new Date(y, m, 0).getDate(); // m월의 마지막 날
  if (d < 1 || d > daysInMonth) return false;

  return true;
};

export default function SignUpBirth({ navigation, route }: Props) {
  const email = route.params?.email ?? '';
  const name = route.params?.name ?? '';
  const sex = route.params?.sex ?? 'M';
  const password = route.params?.password ?? '';

  const [birth, setBirth] = useState('');
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

  const trimmed = birth.trim();
  const canContinue = useMemo(() => isValidBirth(trimmed), [trimmed]);
  const showError = touched && trimmed.length > 0 && !canContinue;
  const showClear = trimmed.length > 0;

  // 숫자만 입력되게
  const onChangeBirth = (v: string) => {
    const onlyDigits = v.replace(/[^\d]/g, '');
    setBirth(onlyDigits.slice(0, 8));
  };

  const onContinue = async () => {
  if (!canContinue) return;

  if (!password) {
    Alert.alert('비밀번호 정보가 없습니다. 이전 단계부터 다시 진행해 주세요.');
    return;
  }

  // YYYYMMDD -> YYYY-MM-DD
  const birthDate = `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`;

  // 'M' | 'F' -> 'MALE' | 'FEMALE'
  const gender = sex === 'M' ? 'MALE' : 'FEMALE';

  const payload = {
    email,
    password,
    nickname: name || email,     
    // name: name || null,
    birthDate,
    gender,
    profileImageUrl: null,
  };
  
  console.log('signup payload:', payload);

  try {
    const res = await publicApi.post('/auth/local/signup', payload);

    const { accessToken, refreshToken, user } = res.data ?? {};
    

    if (accessToken) await saveAccessToken(accessToken);
    if (refreshToken) await saveRefreshToken(refreshToken);
    if (user) await saveUser(user);

    // ✅ 성공했을 때만 성공 화면으로
    navigation.navigate('SignUpSuccess', { email, name, sex, birth: trimmed });
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const message = err?.message;

    console.log('signup error status:', status);
    console.log('signup error data:', data);
    console.log('signup error message:', message);

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

              <Text style={styles.title}>회원가입</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.form}>
              <Text style={styles.guideText}>생년월일을 입력해 주세요</Text>

              <View style={styles.inputRow}>
                <TextInput
                  value={birth}
                  onChangeText={onChangeBirth}
                  onBlur={() => setTouched(true)}
                  placeholder="YYYYMMDD (예: 20040611)"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                  keyboardType="number-pad"
                  maxLength={8}
                  style={styles.input}
                />

                {showClear && (
                  <TouchableOpacity
                    onPress={() => setBirth('')}
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
                <Text style={styles.errorText}>생년월일을 8자리로 정확히 입력해 주세요</Text>
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
  backImage: { width: 20, height: 20 },
  title: { color: '#333333', fontSize: 17, fontWeight: '600' },

  form: { marginTop: 100 },
  guideText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
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
  continueImage: { width: '100%', height: '100%' },
});

