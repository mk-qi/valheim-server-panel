import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestConfig, ApiResponse } from '../types';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  showError?: boolean;
}

class Request {
  private instance: AxiosInstance;
  private baseConfig: RequestConfig = {
    showError: true,
    skipAuth: false,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  constructor(config: RequestConfig) {
    this.instance = axios.create({
      baseURL: '/api',
      timeout: config.timeout || 60000,
      ...this.baseConfig,
      ...config,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && !config.skipAuth) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        if (response.data?.code === 0) {
          return response.data.data;
        }
        return Promise.reject(new Error(response.data?.message || 'Unknown error'));
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(new Error('Authentication required'));
        }
        
        const errorMessage = error.response?.data?.message || error.message;
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  public async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get<any, T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.post<any, T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.put<any, T>(url, data, config);
  }

  public async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete<any, T>(url, config);
  }

  public async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.patch<any, T>(url, data, config);
  }
}

export const request = new Request({});
export default Request;