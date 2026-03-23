// src/api/axios.ts
import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  clearAllTokens,
} from '../utils/authStorage';


const BASE_URL = 'http://3.34.99.179:8080/api/v1';

// ✅ 토큰 없이 쓰는 공개 API (회원가입/로그인/비번재설정/토큰재발급 등)
export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// ✅ 토큰 필요한 API (로그인 이후)
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// 1. 요청 인터셉터: API 쏠 때마다 Access Token 넣기
instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

  } else {
    console.log('🔴 토큰 없음');
  }

  return config;
});

// 2. 응답 인터셉터: 401 에러 발생 시 토큰 자동 재발급 (Refresh Token 활용)
instance.interceptors.response.use(
  (response) => {
    // 정상 응답은 그대로 통과
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 만약 에러가 401(인증 만료)이고, 재시도한 적이 없는 요청이라면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지용 플래그

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          throw new Error('Refresh Token이 없습니다.');
        }

        // 🚨 명세서대로 재발급 API 호출
        const res = await publicApi.post('/auth/token/refresh', {
          refreshToken: refreshToken,
        });

        // 명세서의 Success Response 구조에 맞게 새 토큰 추출
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        // 스토리지에 새 토큰들 저장
        await saveAccessToken(newAccessToken);
        await saveRefreshToken(newRefreshToken);

        // 실패했던 원래 요청의 헤더에 새 Access Token을 끼워넣고 다시 쏘기
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);

      } catch (refreshError) {
        // Refresh Token마저 만료되었거나 올바르지 않은 경우 (401, 400 에러 등)
        console.log('토큰 재발급 실패(로그아웃 처리됨):', refreshError);

        // 토큰들을 다 지워버림 -> 사용자는 다음 동작 시 자연스럽게 로그인 풀림 처리
        await clearAllTokens();

        // 에러를 그대로 반환하여 UI 컴포넌트(ProfileSetting 등)의 catch 블록으로 넘김
        return Promise.reject(refreshError);
      }
    }

    // 401 에러가 아니거나 이미 재시도한 경우라면 에러 그대로 반환
    return Promise.reject(error);
  }
);

export default instance;