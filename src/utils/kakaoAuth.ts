// src/utils/kakaoAuth.ts
import { Linking } from 'react-native';

// 카카오 REST API 키
const REST_API_KEY = '837e7a48da1e70b2b5e40f82eeed27cd';

// 인가코드를 받을 백엔드 콜백 주소
// (카카오 콘솔 Redirect URI에도 이 값이 등록되어 있어야 함)
const REDIRECT_URI =
  'https://todak-backend-705x.onrender.com/oauth/callback/kakao';

export type KakaoTokenResponse = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  [key: string]: any;
};

/**
 * 1) 카카오 로그인 화면을 여는 함수
 *    - 여기서는 단순히 카카오 인증 URL을 오픈만 한다.
 *    - 인가코드는 REDIRECT_URI(백엔드)에서 받게 됨.
 */
export const startKakaoLogin = () => {
  const kakaoAuthUrl =
    'https://kauth.kakao.com/oauth/authorize' +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code`;

  console.log('🟡 [kakaoAuth] 카카오 인증 URL:', kakaoAuthUrl);
  return Linking.openURL(kakaoAuthUrl);
};

/**
 * 2) 프론트에서 인가코드(code)를 받아왔을 때,
 *    카카오 토큰 엔드포인트에 직접 요청해서 access_token 을 교환하는 함수
 */
export const getKakaoToken = async (
  code: string,
): Promise<KakaoTokenResponse> => {
  console.log('🟡 [kakaoAuth] 토큰 교환용 인가 코드:', code);

  const body =
    `grant_type=authorization_code` +
    `&client_id=${encodeURIComponent(REST_API_KEY)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&code=${encodeURIComponent(code)}`;

  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log('❌ [kakaoAuth] 토큰 요청 실패 status:', response.status);
    console.log('❌ [kakaoAuth] 토큰 요청 실패 body:', text);
    throw new Error('카카오 토큰 요청 실패');
  }

  const json = (await response.json()) as KakaoTokenResponse;
  console.log('🟢 [kakaoAuth] 카카오 토큰 응답:', json);
  return json;
};
