


// Generic API response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}


// API error shape
export interface ApiError {
  error?: string;
  message?: string;
  success: boolean;
}
