/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/axios.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
declare module 'axios' {
  export interface InternalAxiosRequestConfig<D = any> {
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip adding token for public endpoints
    const publicEndpoints = [
      '/auth/local',
      '/auth/forgot-password',
      '/auth/resend-otp',
      '/auth/complete-registration',
      '/upload',
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }

    // Don't set Content-Type for FormData, let the browser set it with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
      } catch (refreshError) {
        // If refresh fails, clear storage and redirect to login
        await AsyncStorage.multiRemove(['accessToken', 'userData']);
        // You might want to use a navigation service here instead of window
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
