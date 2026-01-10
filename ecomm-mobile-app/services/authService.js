import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constants/api';

const authApiClient = axios.create({
  baseURL: API_CONFIG.AUTH_API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

authApiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authentication = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async signin(username, password) {
    const response = await authApiClient.post('/signin', {
      username,
      password,
    });
    return response.data;
  },

  async signup(userData) {
    const response = await authApiClient.post('/signup', userData);
    return response.data;
  },

  async checkToken() {
    const response = await authApiClient.get('/verify-token');
    return response.data;
  },

  async logout() {
    const response = await authApiClient.delete('/logout');
    return response.data;
  },
};

export default authApiClient;
