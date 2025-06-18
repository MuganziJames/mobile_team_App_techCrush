// API Types for TechCrush Authentication
export interface User {
  _id: string;
  name: string;
  email: string;
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
  newPassword: string;
  resetToken: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
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