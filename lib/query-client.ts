import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;
        // Don't retry on 4xx errors except 429
        if (
          axiosError?.response?.status &&
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500 &&
          axiosError.response.status !== 429
        ) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
