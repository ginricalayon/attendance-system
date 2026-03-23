"use client";
import { LoginFormData } from "@/app/schema/forms/auth";
import { login } from "@/app/services/auth.service";
import { signInWithEmail } from "@/app/services/firebase.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  ("");

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      try {
        const userCredentials = await signInWithEmail(
          data.email,
          data.password
        );
        const token = await userCredentials.user.getIdToken();

        const response = await login({ token, remember_me: data.remember_me });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log(data);
      // Invalidate session query to ensure we fetch fresh user data
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
