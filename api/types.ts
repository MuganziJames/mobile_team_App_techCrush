// API Types for TechCrush Authentication
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface VerifyResetTokenBody {
  email: string;
  resetToken: string;
}

export interface ChangePasswordBody {
  email: string;
  password: string;
  resetToken: string;
}

export interface LoginResponse {
  data: User;
  message: string;
  status: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth state types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
} 