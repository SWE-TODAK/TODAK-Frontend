import axios from 'axios';
import { getAccessToken } from '../utils/authStorage';

const instance = axios.create({
  baseURL: 'http://3.34.99.179:8080/api/v1',
  timeout: 200000,
});

// 🔥 모든 요청에 자동으로 토큰 붙이기
instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  console.log('🟡 [API 요청] url:', config.url);
  console.log('🟡 [API 요청] token:', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🟢 Authorization 붙음:', config.headers.Authorization);
  } else {
    console.log('🔴 토큰 없음');
  }

  return config;
});

export default instance;
