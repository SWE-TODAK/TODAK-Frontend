import axios from 'axios';
import { getAccessToken } from '../utils/authStorage';

const instance = axios.create({
  baseURL: 'https://todak-backend-705x.onrender.com',
  timeout: 5000,
});

// 🔥 모든 요청에 자동으로 토큰 붙이기
instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
