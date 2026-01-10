export const API_CONFIG = {
  AUTH_API_URL: process.env.EXPO_PUBLIC_AUTH_API_URL || 'http://localhost:8080/api/v1',
  ECOMM_API_URL: process.env.EXPO_PUBLIC_ECOMM_API_URL || 'http://localhost:8081/api/v1',
  TIMEOUT: 10000,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@ecomm_auth_token',
  USER_DATA: '@ecomm_user_data',
};
