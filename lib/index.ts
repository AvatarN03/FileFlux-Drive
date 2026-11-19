import axios, { AxiosError } from "axios";

import { AUTH_TOAST_MESSAGES } from "@/constant";

type ApiError = {
  error?: string;
  message?: string;
  success: boolean;
};

// general error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return (
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      AUTH_TOAST_MESSAGES.NETWORK_ERROR
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export default getErrorMessage;
