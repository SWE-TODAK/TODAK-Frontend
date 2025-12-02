// src/screens/Login.tsx
import React, { useState, useEffect, useRef } from 'react';
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
import { saveAccessToken, getAccessToken } from '../utils/authStorage'; 

// ✅ 카카오 로그인 유틸 (start + code→token 교환)
import { startKakaoLogin, getKakaoToken } from '../utils/kakaoAuth';

import LoginIntro1 from '../components/Login/LoginIntro1';
import LoginIntro2 from '../components/Login/LoginIntro2';
import LoginIntro3 from '../components/Login/LoginIntro3';

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const TOTAL_PAGES = 3;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  // 🔹 카카오 인가 코드로 실제 로그인 처리
  const processLogin = async (code: string) => {
    try {
      console.log('🟡 [Login] 인가 코드 수신, 토큰 교환 시작:', code);

      // 1) 프론트에서 카카오 토큰 직접 발급
      const tokenData = await getKakaoToken(code);
      const kakaoAccessToken = tokenData.access_token;

      if (!kakaoAccessToken) {
        console.error('❌ [Login] 카카오 access_token 없음:', tokenData);
        return;
      }

      console.log('🟢 [Login] 카카오 access_token 발급 완료:', kakaoAccessToken);

      // 2) 우리 백엔드에 카카오 토큰 전달 → 서비스 로그인
      const response = await api.post('/kakao/login', {
        kakaoAccessKey: kakaoAccessToken, // 백엔드에서 기대하는 필드 이름에 맞춰야 함
      });

      console.log('🟢 [Login] 백엔드 로그인 응답:', response.data);

      const accessToken = response.data.data?.accessToken;
      if (!accessToken) {
        console.error('❌ [Login] 우리 서비스 accessToken 없음:', response.data);
        return;
      }

      // 3) 우리 서비스 토큰 저장 후 메인으로 이동
      await saveAccessToken(accessToken);
      console.log('🟢 [Login] 우리 서비스 토큰 저장 완료, MainTabs로 이동');
      navigation.replace('MainTabs');
    } catch (err) {
      console.error('🔴 [Login] 전체 로그인 프로세스 실패:', err);
    }
  };

  // 🔹 딥링크에서 code=... 감지
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log('🟡 [Login] 딥링크 수신:', url);

      if (!url) return;
      const parts = url.split('?');
      if (parts.length < 2) return;

      const queryString = parts[1];
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
      if (code) {
        console.log('🟢 [Login] 인가 코드 획득:', code);
        processLogin(code);
      }
    };

    // 실행 중에 들어오는 딥링크
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // 앱이 완전히 꺼진 상태에서 딥링크로 켜졌을 때 대비
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
      await startKakaoLogin(); // 브라우저/카카오 앱으로 이동
    } catch (err) {
      console.log('🔴 [Login] 카카오 로그인 시작 오류:', err);
    }
  };

  // 스와이프 끝났을 때 인덱스 업데이트
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
          style={[
            styles.dot,
            index === activeIndex && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔼 인트로 영역 */}
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
          onPress={() => {
            navigation.replace('MainTabs');
          }}
        >
          <Text style={styles.adminLoginText}>병원 관리자 로그인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topArea: {
    flex: 1,
  },
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
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3D3D3',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#555555',
  },
  kakaoButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoImage: {
    width: '100%',
    height: '100%',
  },
  adminLoginText: {
    fontSize: 12,
    color: '#777777',
    textDecorationLine: 'underline',
  },
});
