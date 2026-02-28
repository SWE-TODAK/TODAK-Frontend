// src/utils/kakaoAuth.ts
import { Linking } from 'react-native';
import { saveAccessToken, saveRefreshToken, saveUser } from './authStorage';

// ✅ 백엔드 base url
export const BACKEND_BASE_URL = 'http://3.34.99.179:8080';

// ✅ 카카오 로그인 "시작" URL (백엔드가 카카오 authorize로 리다이렉트 처리)
const KAKAO_START_PATH = '/oauth2/authorization/kakao';

// ✅ 교환(exchange) API (스웨거 명세에 맞추기)
const KAKAO_LOGIN_API_PATH = '/auth/kakao/login';
const KAKAO_SIGNUP_API_PATH = '/auth/kakao/signup';

export type BackendAuthResponse = {
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
  user?: {
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
 * 1) 카카오 로그인 시작
 * - ✅ 프론트가 kauth.kakao.com URL을 직접 만들지 않음
 * - ✅ 백엔드 시작 URL만 열면, 백이 카카오로 보내줌
 */
export const startKakaoLogin = () => {
  const startUrl = `${BACKEND_BASE_URL}${KAKAO_START_PATH}`;
  console.log('🟡 [kakao] open start url:', startUrl);
  return Linking.openURL(startUrl);
};

/**
 * 2) (로그인) 딥링크로 받은 code를 백엔드 exchange API로 보내서 JWT 받기
 * - ⚠️ 백이 redirectUri를 "필수"로 받는다면 body에 redirectUri를 추가해야 함.
 */
export const kakaoLoginToBackend = async (
  authorizationCode: string,
  redirectUri?: string, // 필요 시만 사용
): Promise<BackendAuthResponse> => {
  const body: any = { authorizationCode };
  if (redirectUri) body.redirectUri = redirectUri;

  const res = await fetch(`${BACKEND_BASE_URL}${KAKAO_LOGIN_API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log('❌ [kakaoLoginToBackend] fail:', res.status, data);
    throw new Error(data?.message ?? '카카오 로그인 실패');
  }

  await saveAccessToken(data.accessToken);
  await saveRefreshToken(data.refreshToken);
  if (data.user) await saveUser(data.user);

  return data;
};

/**
 * 3) (회원가입) consents 포함해서 exchange
 */
export const kakaoSignupToBackend = async (
  authorizationCode: string,
  consents: Consent[],
  redirectUri?: string, // 필요 시만 사용
): Promise<BackendAuthResponse> => {
  const body: any = { authorizationCode, consents };
  if (redirectUri) body.redirectUri = redirectUri;

  const res = await fetch(`${BACKEND_BASE_URL}${KAKAO_SIGNUP_API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log('❌ [kakaoSignupToBackend] fail:', res.status, data);
    throw new Error(data?.message ?? '카카오 회원가입 실패');
  }

  await saveAccessToken(data.accessToken);
  await saveRefreshToken(data.refreshToken);
  if (data.user) await saveUser(data.user);

  return data;
};