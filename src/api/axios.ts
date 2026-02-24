import axios from 'axios';
import { getAccessToken } from '../utils/authStorage';

const BASE_URL = 'http://3.34.99.179:8080';

// ✅ 토큰 없이 쓰는 공개 API (회원가입/로그인/비번재설정 등)
export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 200000,
});

// ✅ 토큰 필요한 API (로그인 이후)
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 200000,
});

instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;