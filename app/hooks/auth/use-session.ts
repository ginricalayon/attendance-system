import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/app/services/auth.service";

export interface SessionData {
  uid: string;
  email: string | undefined;
  emailVerified: boolean;
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const response = await getSession();
        return response.data as SessionData;
      } catch (error) {
        // If 401 Unauthorized or other error, return null to indicate no session
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry if fetching session fails (e.g. 401)
  });
}
