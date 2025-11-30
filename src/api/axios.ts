import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://todak-backend-705x.onrender.com',
  timeout: 5000,
});

export default instance;
