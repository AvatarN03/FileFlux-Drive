import axios, { AxiosError } from "axios";
import { ApiError } from "@/types/auth";
import { TOAST_MESSAGES } from "@/constant";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return (
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      TOAST_MESSAGES.NETWORK_ERROR
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export default getErrorMessage;