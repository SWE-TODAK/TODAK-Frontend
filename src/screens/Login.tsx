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

import { getAccessToken } from '../utils/authStorage';
import { startKakaoLogin, kakaoLoginToBackend } from '../utils/kakaoAuth';


import LoginIntro1 from '../components/Login/LoginIntro1';
import LoginIntro2 from '../components/Login/LoginIntro2';

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const TOTAL_PAGES = 2;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Login: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);
  const currentIndexRef = useRef(0);
  const navigation = useNavigation<LoginNavProp>();

  // 앱 켰을 때 이미 토큰이 있으면 바로 MainTabs로 이동
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

  // 딥링크로 받은 code를 백엔드 exchange API에 전달
  const processLogin = useCallback(
    async (code: string) => {
      try {
        console.log('🟡 [Login] authorizationCode 수신:', code);

        const data = await kakaoLoginToBackend(code);

        console.log('🟢 [Login] 백엔드 응답:', data);
        console.log('🟢 [Login] 저장 완료 → MainTabs로 이동');

        navigation.replace('MainTabs');
      } catch (err) {
        console.error('🔴 [Login] 로그인 실패:', err);
      }
    },
    [navigation],
  );

  // 딥링크에서 code=... 감지
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
        </ScrollView>
      </View>

      <View style={styles.bottomArea}>
        {renderDots()}

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

        <TouchableOpacity onPress={() => navigation.replace('MainTabs')}>
          <Text style={styles.adminLoginText}>병원 관리자 로그인</Text>
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
    marginBottom: 10,
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