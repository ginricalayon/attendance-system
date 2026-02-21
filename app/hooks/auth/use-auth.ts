import { LoginFormData } from "@/app/schema/forms/auth";
import { useLogin } from "./use-login";
import { useSession } from "./use-session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as authLogout } from "@/app/services/auth.service";
import { useRouter } from "next/navigation";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // mutations
  const loginMutation = useLogin();
  
  const logoutMutation = useMutation({
    mutationFn: authLogout,
    onSettled: () => {
      queryClient.setQueryData(["session"], null);
      router.push("/login"); // Redirect to login page on logout
    }
  });

  // queries
  const { data: session, isLoading: isSessionLoading } = useSession();

  // actions
  const login = async (data: LoginFormData) => {
    return await loginMutation.mutateAsync(data);
  };

  const logout = async () => {
    return await logoutMutation.mutateAsync();
  };

  return {
    loginMutation,
    logoutMutation,
    login,
    logout,
    session,
    isSessionLoading,
  };
}
