import { api } from "@/lib/api";
import { ILoginRequest } from "../lib/schema/auth.schema";

export async function login(data: ILoginRequest) {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export async function getSession() {
  const response = await api.get("/auth/session");
  return response.data;
}

export async function logout() {
  const response = await api.post("/auth/logout");
  return response.data;
}
