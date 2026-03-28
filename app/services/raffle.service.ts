import { api } from "@/lib/api";
import {
  IRaffleEligibleStudent,
  IRaffleWinner,
} from "../lib/schema/raffle.schema";

export async function getEligibleStudents(): Promise<{
  success: boolean;
  data: { students: IRaffleEligibleStudent[]; total: number };
}> {
  const response = await api.get("/raffle/eligible");
  return response.data;
}

export async function pickWinners(): Promise<{
  success: boolean;
  data: IRaffleWinner[];
}> {
  const response = await api.post("/raffle/pick");
  return response.data;
}

export async function getWinners(): Promise<{
  success: boolean;
  data: IRaffleWinner[];
}> {
  const response = await api.get("/raffle/winners");
  return response.data;
}
