// src/utils/kakaoAuth.ts
import { Linking } from 'react-native';
import { saveAccessToken, saveRefreshToken, saveUser } from './authStorage';

// ✅ 백엔드 base url
const BACKEND_BASE_URL = 'http://3.34.99.179:8080';

<<<<<<< HEAD
// ✅ 백엔드의 카카오 로그인 시작 URL
const KAKAO_START_PATH = '/oauth2/authorization/kakao';

// ✅ exchange API
=======
// ✅ 카카오 콘솔에 등록된 Redirect URI (그리고 authorize 요청에 사용한 값과 동일해야 함)
export const KAKAO_REDIRECT_URI =
  'http://3.34.99.179:8080/oauth2/authorization/kakao';

// ✅ 너희 백엔드 base url
const BACKEND_BASE_URL = 'http://3.34.99.179:8080';

// ✅ 스웨거 명세에 있는 실제 경로로 바꿔줘야 함
>>>>>>> main
const KAKAO_LOGIN_API_PATH = '/auth/kakao/login';
const KAKAO_SIGNUP_API_PATH = '/auth/kakao/signup';

// ✅ 앱이 받아야 하는 모바일 콜백 딥링크
export const MOBILE_CALLBACK_URI = 'todak://auth/callback';

export type BackendAuthResponse = {
  isNewUser?: boolean;
  accessToken?: string;
  refreshToken?: string;
  token?: {
    tokenType?: string;
    accessToken: string;
    refreshToken: string;
    expiresInSeconds?: number;
    rotated?: boolean;
  };
  user?: {
    userId: string;
    email: string | null;
    name?: string;
    nickname?: string;
    birthDate: string | null;
    gender?: 'MALE' | 'FEMALE' | null;
    profileImageUrl: string | null;
    providers: string[];
  };
  newUser?: boolean;
};

export type Consent = {
  consentType: 'TERMS' | 'PRIVACY';
  agreed: boolean;
  version: string;
  source: 'SIGNUP';
};

/**
 * 1) 카카오 로그인 시작
 * - 프론트가 카카오 authorize URL 직접 생성 ❌
 * - 백엔드 시작 URL만 연다 ✅
 */
export const startKakaoLogin = async () => {
  const startUrl = `${BACKEND_BASE_URL}${KAKAO_START_PATH}`;
  console.log('🟡 [kakao] start url:', startUrl);
  return Linking.openURL(startUrl);
};

/**
 * 응답 구조에서 토큰/user를 안전하게 꺼내는 헬퍼
 */
const extractAuthPayload = (data: any) => {
  const accessToken = data?.token?.accessToken ?? data?.accessToken;
  const refreshToken = data?.token?.refreshToken ?? data?.refreshToken;
  const user = data?.user ?? null;

  return { accessToken, refreshToken, user };
};

/**
 * 2) 카카오 로그인 exchange
 * - 딥링크로 받은 code를 백엔드로 전달
 */
export const kakaoLoginToBackend = async (
  authorizationCode: string,
): Promise<BackendAuthResponse> => {
  const res = await fetch(`${BACKEND_BASE_URL}${KAKAO_LOGIN_API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorizationCode }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log('❌ [kakaoLoginToBackend] fail:', res.status, data);
    throw new Error(data?.message ?? '카카오 로그인 실패');
  }

  const { accessToken, refreshToken, user } = extractAuthPayload(data);

  if (!accessToken || !refreshToken) {
    console.log('❌ [kakaoLoginToBackend] token missing:', data);
    throw new Error('TOKEN_MISSING');
  }

  await saveAccessToken(accessToken);
  await saveRefreshToken(refreshToken);
  if (user) await saveUser(user);

  return data;
};

/**
 * 3) 카카오 회원가입 exchange
 */
export const kakaoSignupToBackend = async (
  authorizationCode: string,
  consents: Consent[],
): Promise<BackendAuthResponse> => {
  const res = await fetch(`${BACKEND_BASE_URL}${KAKAO_SIGNUP_API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorizationCode, consents }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log('❌ [kakaoSignupToBackend] fail:', res.status, data);
    throw new Error(data?.message ?? '카카오 회원가입 실패');
  }

  const { accessToken, refreshToken, user } = extractAuthPayload(data);

  if (!accessToken || !refreshToken) {
    console.log('❌ [kakaoSignupToBackend] token missing:', data);
    throw new Error('TOKEN_MISSING');
  }

  await saveAccessToken(accessToken);
  await saveRefreshToken(refreshToken);
  if (user) await saveUser(user);

  return data;
};