// src/utils/kakaoAuth.ts
import { Linking } from 'react-native';
import { saveAccessToken, saveRefreshToken,saveUser} from './authStorage';

// ✅ 카카오 REST API 키 (가능하면 env로 빼는 걸 추천)
const REST_API_KEY = '89015c2a864ed9dbb9f3e9e9f1c0bd92';

// ✅ 카카오 콘솔에 등록된 Redirect URI (그리고 authorize 요청에 사용한 값과 동일해야 함)
export const KAKAO_REDIRECT_URI =
  'http://localhost:8080/login/oauth2/code/kakao';

// ✅ 너희 백엔드 base url
const BACKEND_BASE_URL = 'https://todak.com/api/v1';

// ✅ 스웨거 명세에 있는 실제 경로로 바꿔줘야 함
const KAKAO_LOGIN_API_PATH = '/auth/kakao/login';
const KAKAO_SIGNUP_API_PATH = '/auth/kakao/signup';

export type BackendAuthResponse = {
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    email: string | null;
    name: string;
    birthDate: string | null;
    gender: 'MALE' | 'FEMALE' | null;
    profileImageUrl: string | null;
    providers: string[];
  };
};

export type Consent = {
  consentType: 'TERMS' | 'PRIVACY';
  agreed: boolean;
  version: string; // 예: "v1.0"
  source: 'SIGNUP';
};

/**
 * 1) 카카오 로그인 화면 열기 (인가코드 받기용)
 */
export const startKakaoLogin = () => {
  const kakaoAuthUrl =
    'https://kauth.kakao.com/oauth/authorize' +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
    `&response_type=code`;

  return Linking.openURL(kakaoAuthUrl);
};

/**
 * 2) (로그인) 백엔드에 authorizationCode + redirectUri 전달 → JWT 받기
 */
export const kakaoLoginToBackend = async (
  authorizationCode: string,
  redirectUri: string = KAKAO_REDIRECT_URI,
): Promise<BackendAuthResponse> => {
  const res = await fetch(`${BACKEND_BASE_URL}${KAKAO_LOGIN_API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorizationCode, redirectUri }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // 백엔드가 내려주는 code/message를 그대로 찍어보면 디버깅이 쉬움
    console.log('❌ [kakaoLoginToBackend] fail:', res.status, data);
    throw new Error(data?.message ?? '카카오 로그인 실패');
  }

  // ✅ 토큰 저장
  await saveAccessToken(data.accessToken);
  await saveRefreshToken(data.refreshToken);

  return data;
};

/**
 * 3) (회원가입) 백엔드에 authorizationCode + redirectUri + consents 전달 → JWT 받기
 */
export const kakaoSignupToBackend = async (
  authorizationCode: string,
  consents: Consent[],
  redirectUri: string = KAKAO_REDIRECT_URI,
): Promise<BackendAuthResponse> => {
  const res = await fetch(`${BACKEND_BASE_URL}${KAKAO_SIGNUP_API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorizationCode, redirectUri, consents }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log('❌ [kakaoSignupToBackend] fail:', res.status, data);
    throw new Error(data?.message ?? '카카오 회원가입 실패');
  }

  await saveAccessToken(data.accessToken);
  await saveRefreshToken(data.refreshToken);

  return data;
};
