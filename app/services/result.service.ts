import { api } from "@/lib/api";
import { ResultsApiResponse } from "../hooks/dashboard/use-result";

export async function getResult() {
  const response = await api.get<ResultsApiResponse>("/result");
  return response.data.data;
}
