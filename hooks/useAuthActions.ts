import useAuthStore from "@/context/useAuthStore";

const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);

  return {
    login,
    signup,
    logout,
    checkAuth,
    deleteAccount,
  };
};

export default useAuthActions;