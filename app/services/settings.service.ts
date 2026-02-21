import { api } from "@/lib/api";
import { ISettings } from "../lib/schema/settings.schema";
import { AxiosError } from "axios";

export async function getSettings(): Promise<{ success: boolean; data: ISettings | null }> {
  try {
    const response = await api.get("/settings");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return { success: true, data: null };
    }
    throw error;
  }
}
