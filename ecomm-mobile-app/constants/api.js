import Constants from 'expo-constants';

export const API_CONFIG = {
  AUTH_API_URL: Constants.expoConfig?.extra?.authApiUrl || 'http://localhost:8080/api/v1',
  ECOMM_API_URL: Constants.expoConfig?.extra?.ecommApiUrl || 'http://localhost:8081/api/v1',
  TIMEOUT: 10000,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@ecomm_auth_token',
  USER_DATA: '@ecomm_user_data',
};
