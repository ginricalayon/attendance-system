import { api } from "@/lib/api";
import {
  ICreateAttendanceRequest,
  IGetAttendancesQuery,
  IAttendance,
} from "../lib/schema/attendance.schema";

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}

export async function createAttendance(
  data: ICreateAttendanceRequest
): Promise<{ success: boolean; data: IAttendance }> {
  const response = await api.post("/attendance", data);
  return response.data;
}

export async function getAttendances(
  params?: IGetAttendancesQuery
): Promise<PaginatedResponse<IAttendance>> {
  const response = await api.get("/attendance", { params });
  return response.data;
}

export async function deleteAttendances(): Promise<{ success: boolean; data: any }> {
  const response = await api.delete("/attendance");
  return response.data;
}
