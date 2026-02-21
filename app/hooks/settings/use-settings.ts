import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/app/services/settings.service";

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
