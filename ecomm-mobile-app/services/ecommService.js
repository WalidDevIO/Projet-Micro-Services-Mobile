import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constants/api';

const ecommApiClient = axios.create({
  baseURL: API_CONFIG.ECOMM_API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

ecommApiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authentication = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

ecommApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
    return Promise.reject(error);
  }
);

export const categoryService = {
  async getAll() {
    const response = await ecommApiClient.get('/categories');
    return response.data;
  },

  async getById(id) {
    const response = await ecommApiClient.get(`/categories/${id}`);
    return response.data;
  },
};

export const articleService = {
  async getAll(categoryId = null) {
    const url = categoryId ? `/articles?categoryId=${categoryId}` : '/articles';
    const response = await ecommApiClient.get(url);
    return response.data;
  },

  async getById(id) {
    const response = await ecommApiClient.get(`/articles/${id}`);
    return response.data;
  },
};

export const cartService = {
  async getCart() {
    const response = await ecommApiClient.get('/cart');
    return response.data;
  },

  async addItem(articleId, quantity) {
    const response = await ecommApiClient.post('/cart', {
      articleId,
      quantity,
    });
    return response.data;
  },

  async updateItem(cartItemId, quantity) {
    const response = await ecommApiClient.put(`/cart/${cartItemId}`, {
      quantity,
    });
    return response.data;
  },

  async removeItem(cartItemId) {
    await ecommApiClient.delete(`/cart/${cartItemId}`);
  },

  async clearCart() {
    await ecommApiClient.delete('/cart');
  },
};

export default ecommApiClient;
