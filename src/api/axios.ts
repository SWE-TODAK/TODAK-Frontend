import axios from 'axios';
import { getAccessToken } from '../utils/authStorage';

<<<<<<< HEAD
<<<<<<< HEAD
const BASE_URL = 'http://3.34.99.179:8080/api/v1';

// ✅ 토큰 없이 쓰는 공개 API (회원가입/로그인/비번재설정 등)
export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 200000,
});

// ✅ 토큰 필요한 API (로그인 이후)
const instance = axios.create({
  baseURL: BASE_URL,
=======
const instance = axios.create({
  baseURL: 'http://3.34.99.179:8080/api/v1',
>>>>>>> 2fb3896 (feat:지표 수동 생성 API 연동#19)
=======
const instance = axios.create({
  baseURL: 'http://3.34.99.179:8080/api/v1',
>>>>>>> 2fb389674ca266d985f26bf8c851af17044d0dc2
  timeout: 200000,
});

instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
<<<<<<< HEAD
  if (token) config.headers.Authorization = `Bearer ${token}`;
=======

  console.log('🟡 [API 요청] url:', config.url);
  console.log('🟡 [API 요청] token:', token);

  console.log('🟡 [API 요청] url:', config.url);
  console.log('🟡 [API 요청] token:', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🟢 Authorization 붙음:', config.headers.Authorization);
  } else {
    console.log('🔴 토큰 없음');
  }

>>>>>>> 2fb3896 (feat:지표 수동 생성 API 연동#19)
  return config;
});

export default instance;