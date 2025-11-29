// Login.tsx
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginIntro1 from '../components/Login/LoginIntro1'
import LoginIntro2 from '../components/Login/LoginIntro2'
import LoginIntro3 from '../components/Login/LoginIntro3'
import { startKakaoLogin } from '../utils/kakaoAuth';
import { saveAccessToken } from '../utils/authStorage';


type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const TOTAL_PAGES = 3;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Login: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);
  const currentIndexRef = useRef(0); // 실제 현재 인덱스 저장

   // 🔁 자동 슬라이드: interval은 딱 한 번만 생성
   useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % TOTAL_PAGES;
      currentIndexRef.current = nextIndex;

      scrollRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const navigation = useNavigation<LoginNavProp>();

  const handleKakaoLogin = async () => {
    try {
      // 1) 카카오 로그인 진행 (code 받아옴)
      const loginResult = await startKakaoLogin(); 
      // loginResult 안에 code가 담겨 있다고 가정
  
      const code = loginResult.code;
  
      // 2) 서버에 code 보내서 우리 서비스 토큰 받기
      const response = await fetch("http://서버주소/kakao/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
  
      const data = await response.json();
      const token = data.accessToken;  // 서버가 준 우리 서비스 토큰
  
      // 3) 토큰 저장
      await saveAccessToken(token);
  
      // 4) MainScreen으로 이동
      navigation.replace("MainTabs");
  
    } catch (err) {
      console.log("카카오 로그인 오류:", err);
    }
  };

  // 👆 스와이프로 넘기거나, 자동 스크롤 애니메이션이 끝났을 때
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
            navigation.replace("MainTabs");
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
    overflow: 'hidden', // 이미지 모서리 둥글게 같이 잘리도록
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
