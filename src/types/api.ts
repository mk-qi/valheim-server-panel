// Response Types
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// Request Types
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url?: string;
  data?: any;
  showError?: boolean;
  skipAuth?: boolean;
  params?: Record<string, any>;
  headers?: Record<string, any>;
  timeout?: number;
}