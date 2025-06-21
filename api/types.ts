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

// Blog API Types - Updated to match actual API response
export interface BlogPost {
  id: string; // UUID from API
  title: string;
  content: string;
  imageUrl: string;
  status: string; // "Published", "Draft", etc.
  views: number;
  categoryId: string;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
  };
  creator: {
    name: string;
  };
  updater: {
    name: string;
  } | null;
}

export interface BlogsResponse {
  status: boolean;
  message: string;
  total: number;
  data: BlogPost[];
}

export interface BlogDetailResponse {
  status: boolean;
  message: string;
  data: BlogPost;
}

export interface BlogsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}

// Outfit/Styles API Types - New
export interface Outfit {
  id: string; // UUID from API
  title: string;
  description: string;
  imageUrls: string[];
  categoryId: string;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
  };
  creator: {
    name: string;
  };
  updater: {
    name: string;
  } | null;
}

export interface OutfitsResponse {
  status: boolean;
  message: string;
  total: number;
  data: Outfit[];
}

export interface OutfitDetailResponse {
  status: boolean;
  message: string;
  data: Outfit;
}

export interface OutfitsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

// Category API Types
export interface Category {
  id: string; // UUID from API
  name: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  creator: {
    name: string;
  } | null;
  updater: {
    name: string;
  } | null;
}

export interface CategoriesResponse {
  status: boolean;
  message: string;
  total: number;
  data: Category[];
}

// Lookbook API Types
export interface Lookbook {
  id: string; // UUID from API
  name: string;
  createdAt: string;
  updatedAt: string;
  outfits?: Outfit[]; // Only present in detailed response
}

export interface LookbookWithOutfits extends Lookbook {
  outfits: Outfit[];
}

export interface LookbooksResponse {
  status: boolean;
  message: string;
  total: number;
  data: Lookbook[];
}

export interface LookbookDetailResponse {
  status: boolean;
  message: string;
  totalOutfits: number;
  data: LookbookWithOutfits;
}

export interface CreateLookbookBody {
  name: string;
}

export interface UpdateLookbookBody {
  name: string;
}

export interface AddOutfitToLookbookBody {
  outfitId: string;
} 