// lib/toast.ts
import { toast, Bounce, ToastContent, ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastConfig {
  data: ToastContent;
  type: ToastType;
  options?: Partial<ToastOptions>;
}

const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: true,
  theme: "dark",
  transition: Bounce,
};

const toastC = ({ data, type, options }: ToastConfig) => {
  // Ensure data is always valid ToastContent
  const content: ToastContent = data || "An error occurred";

  const mergedOptions = {
    ...DEFAULT_TOAST_OPTIONS,
    ...options,
  };

  return toast[type](content, mergedOptions);
};

export default toastC;

// ============================================
// HELPER FUNCTIONS FOR COMMON USE CASES
// ============================================

/**
 * Show success toast
 */
export const toastSuccess = (message: string, options?: Partial<ToastOptions>) => {
  return toastC({ data: message, type: "success", options });
};

/**
 * Show error toast
 */
export const toastError = (message: string, options?: Partial<ToastOptions>) => {
  return toastC({ data: message, type: "error", options });
};

/**
 * Show info toast
 */
export const toastInfo = (message: string, options?: Partial<ToastOptions>) => {
  return toastC({ data: message, type: "info", options });
};

/**
 * Show warning toast
 */
export const toastWarning = (message: string, options?: Partial<ToastOptions>) => {
  return toastC({ data: message, type: "warning", options });
};