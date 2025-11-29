// src/utils/kakaoAuth.ts
import { Linking } from 'react-native';

const REST_API_KEY = '837e7a48da1e70b2b5e40f82eeed27cd';
const REDIRECT_URI = 'http://localhost:3000/oauth/callback/kakao';

// 카카오 로그인 플로우 시작
export const startKakaoLogin = () => {
  const kakaoAuthUrl =
    'https://kauth.kakao.com/oauth/authorize' +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code`;

  // 휴대폰/에뮬레이터 브라우저로 이동
  return Linking.openURL(kakaoAuthUrl);
};
