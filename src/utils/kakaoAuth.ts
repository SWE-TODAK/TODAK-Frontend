import { Linking } from 'react-native';

const REST_API_KEY = '837e7a48da1e70b2b5e40f82eeed27cd';

// 카카오에 전달할 redirect_uri (백엔드 콜백)
const KAKAO_REDIRECT_URI =
  'https://todak-backend-705x.onrender.com/oauth/callback/kakao';

// 앱에서 받을 딥링크 스킴
const APP_DEEP_LINK = 'todak://kakao-login';

type KakaoTokenResponse = {
  access_token: string;
  refresh_token?: string;
  [key: string]: any;
};

export const getKakaoToken = async (
  code: string,
): Promise<KakaoTokenResponse> => {
  const data: Record<string, string> = {
    grant_type: 'authorization_code',
    client_id: REST_API_KEY,
    redirect_uri: KAKAO_REDIRECT_URI, // 🔴 여기도 https 콜백 주소 사용!
    code: code,
  };

  const queryString = Object.keys(data)
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type':
        'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: queryString,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log('❌ [kakaoAuth] 토큰 요청 실패 상태:', response.status);
    console.log('❌ [kakaoAuth] 토큰 요청 실패 응답:', text);
    throw new Error('카카오 토큰 요청 실패');
  }

  const json = (await response.json()) as KakaoTokenResponse;
  console.log('🟢 [kakaoAuth] 카카오 토큰 응답:', json);
  return json;
};

export const startKakaoLogin = async (): Promise<KakaoTokenResponse> => {
  return new Promise((resolve, reject) => {
    const kakaoAuthUrl =
      'https://kauth.kakao.com/oauth/authorize' +
      `?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
      `&response_type=code`;

    let subscription: { remove: () => void } | null = null;

    const handleUrl = async (event: { url: string }) => {
      try {
        const { url } = event;
        console.log('🟡 [kakaoAuth] 딥링크 수신:', url);

        // todak://kakao-login 으로 온 것만 처리
        if (!url.startsWith(APP_DEEP_LINK)) return;

        subscription?.remove();

        const parts = url.split('?');
        if (parts.length < 2) throw new Error('쿼리스트링 없음');
        const queryString = parts[1];

        const params: Record<string, string> = {};
        queryString.split('&').forEach(part => {
          const [rawKey, rawValue] = part.split('=');
          if (!rawKey) return;
          const key = decodeURIComponent(rawKey);
          const value = decodeURIComponent(rawValue ?? '');
          params[key] = value;
        });

        console.log('🟡 [kakaoAuth] 파싱된 파라미터:', params);

        const code = params['code'];
        console.log('🟡 [kakaoAuth] 인가 코드:', code);

        if (!code) throw new Error('인가 코드(code)가 없습니다.');

        // 👇 여기서 프론트가 직접 access_token 받아옴
        const tokenResponse = await getKakaoToken(code);
        resolve(tokenResponse);
      } catch (e) {
        reject(e);
      }
    };

    subscription = Linking.addEventListener('url', handleUrl);

    Linking.openURL(kakaoAuthUrl).catch(err => {
      subscription?.remove();
      reject(err);
    });
  });
};
