import { STORAGE_KEY } from "@/constant";
import useAuthStore from "@/context/useAuthStore";



export const clearAuthStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};



export const useUser = () => {
  return useAuthStore((state) => state.user);
};

export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated);
};