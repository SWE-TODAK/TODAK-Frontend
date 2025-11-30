// src/utils/kakaoAuth.ts
import { Linking } from 'react-native';

const REST_API_KEY = '837e7a48da1e70b2b5e40f82eeed27cd';
const REDIRECT_URI = 'https://todak-backend-705x.onrender.com/oauth/callback/kakao';

export const startKakaoLogin = () => {
  const kakaoAuthUrl =
    'https://kauth.kakao.com/oauth/authorize' +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code`;

  return Linking.openURL(kakaoAuthUrl);
};

