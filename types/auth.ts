// Generic API response
export type ApiResponse<T = unknown> = {
  success: boolean;
  status?: number;
  user?: T;            // renamed from `user` → more reusable
  error?: string;
};

// Auth input (login / signup)
export interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
}

// User model
export interface User {
  name: string;
  email: string;
  createdAt: string; // keep string (API safe)
}

// Auth store / hook interface
export interface UseAuthProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: AuthCredentials) => Promise<ApiResponse<User>>;
  signup: (credentials: AuthCredentials) => Promise<ApiResponse<User>>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<ApiResponse<null>>;
  deleteAccount: () => Promise<void>;
}

// Token creation
export interface SigninTokenProps {
  data: Record<string, unknown>; // safer than object
  expireDays?: number | string;
}

// API error shape
export interface ApiError {
  error?: string;
  message?: string;
}
