import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, configureSettings } from "@/app/services/settings.service";

export const settingsKeys = {
  all: ["settings"] as const,
  detail: () => [...settingsKeys.all, "detail"] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: () => getSettings(),
  });
}

export function useConfigureSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: configureSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}
