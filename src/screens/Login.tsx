// src/screens/Login.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ 백엔드 호출 & 토큰 저장
import api from '../api/axios';
// ✅ 카카오 로그인 유틸 (start만 사용)
import {
  saveAccessToken,
  saveRefreshToken,
  saveUser,
  getAccessToken, 
} from '../utils/authStorage';

// ✅ 카카오 로그인 유틸 (start만 사용)
import { startKakaoLogin } from '../utils/kakaoAuth';

import LoginIntro1 from '../components/Login/LoginIntro1';
import LoginIntro2 from '../components/Login/LoginIntro2';
import LoginIntro3 from '../components/Login/LoginIntro3';

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const TOTAL_PAGES = 3;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ✅ 렌더마다 바뀌지 않는 상수는 밖으로
const REDIRECT_URI =
  'https://todak-backend-705x.onrender.com/oauth/callback/kakao';

const Login: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);
  const currentIndexRef = useRef(0);
  const navigation = useNavigation<LoginNavProp>();

  // ✅ 앱 켰을 때 이미 토큰이 있으면 바로 MainTabs로 이동
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          console.log('🔵 이미 로그인된 사용자, MainTabs로 바로 이동');
          navigation.replace('MainTabs');
        }
      } catch (e) {
        console.log('자동 로그인 체크 실패', e);
      }
    };

    checkLoggedIn();
  }, [navigation]);

  // ✅ useCallback으로 고정 (딥링크 리스너 안정화)
  const processLogin = useCallback(
    async (code: string) => {
      try {
        console.log('🟡 [Login] authorizationCode 수신:', code);

        // ✅ 백엔드로 code 전달 (카카오 토큰 교환은 백이 함)
        const res = await api.post('/auth/kakao/login', {
          authorizationCode: code,
          redirectUri: REDIRECT_URI,
        });

        console.log('🟢 [Login] 백엔드 응답:', res.data);

        // ⚠️ 백 응답이 { data: { ... } } 형태면 여기 맞춰줘야 함
        // 지금은 res.data가 바로 { accessToken, refreshToken, user } 라고 가정
        const { accessToken, refreshToken, user } = res.data;

        if (!accessToken || !refreshToken) {
          console.error('❌ [Login] 토큰 누락:', res.data);
          return;
        }

        await saveAccessToken(accessToken);
        await saveRefreshToken(refreshToken);
        if (user) await saveUser(user);

        console.log('🟢 [Login] 저장 완료 → MainTabs로 이동');
        navigation.replace('MainTabs');
      } catch (err) {
        console.error('🔴 [Login] 로그인 실패:', err);
      }
    },
    [navigation],
  );

  // 🔹 딥링크에서 code=... 감지
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log('🟡 [Login] 딥링크 수신:', url);

      if (!url) return;

      const qIndex = url.indexOf('?');
      if (qIndex === -1) return;

      const queryString = url.slice(qIndex + 1);
      const params: Record<string, string> = {};

      queryString.split('&').forEach(part => {
        const [rawKey, rawValue] = part.split('=');
        if (!rawKey) return;
        const key = decodeURIComponent(rawKey);
        const value = decodeURIComponent(rawValue ?? '');
        params[key] = value;
      });

      console.log('🟡 [Login] 딥링크 파라미터:', params);

      const code = params['code'];
      const error = params['error'];

      if (error) {
        console.log('🔴 [Login] 카카오 인증 에러:', error, params);
        return;
      }

      if (code) {
        console.log('🟢 [Login] 인가 코드 획득:', code);
        processLogin(code);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    })();

    return () => {
      subscription.remove();
    };
  }, [processLogin]);

  // 🔘 카카오 로그인 버튼 처리: 카카오 로그인 화면만 띄우면 됨
  const handleKakaoLogin = async () => {
    try {
      console.log('🟡 [Login] 카카오 로그인 플로우 시작');
      await startKakaoLogin();
    } catch (err) {
      console.log('🔴 [Login] 카카오 로그인 시작 오류:', err);
    }
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SCREEN_WIDTH);

    currentIndexRef.current = newIndex;
    setActiveIndex(newIndex);
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topArea}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
        >
          <View style={styles.introPage}>
            <LoginIntro1 />
          </View>
          <View style={styles.introPage}>
            <LoginIntro2 />
          </View>
          <View style={styles.introPage}>
            <LoginIntro3 />
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomArea}>
        {renderDots()}

        {/* 카카오 로그인 */}
        <TouchableOpacity
          style={styles.kakaoButton}
          activeOpacity={0.8}
          onPress={handleKakaoLogin}
        >
          <Image
            source={require('../assets/icons/kakao_login_large_wide.png')}
            style={styles.kakaoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 이메일 로그인 */}
        <TouchableOpacity
          style={styles.emailButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('LocalLogin')}
        >
          <Image
            source={require('../assets/icons/email_login_large_wide.png')}
            style={styles.emailImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 관리자 로그인 */}
        <TouchableOpacity
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.adminLoginText}>
            병원 관리자 로그인
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topArea: { flex: 1 },
  introPage: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  bottomArea: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  dotsContainer: { flexDirection: 'row', marginBottom: 20 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3D3D3',
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: '#555555' },
  kakaoButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  kakaoImage: { width: '100%', height: '100%' },

  emailButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10, // 관리자 로그인 텍스트와 간격
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailImage: {
    width: '100%',
    height: '100%',
  },

  adminLoginText: {
    fontSize: 12,
    color: '#777777',
    textDecorationLine: 'underline',
  },
});
