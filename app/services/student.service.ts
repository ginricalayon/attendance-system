import { api } from "@/lib/api";
import { 
  IGetStudentsQuery, 
  ICreateStudentRequest, 
  IUpdateStudentRequest 
} from "../lib/schema/student.schema";

export async function getStudents(params: IGetStudentsQuery) {
  const response = await api.get("/student", { params });
  return response.data;
}

export async function getStudent(id: string) {
  const response = await api.get(`/student/${id}`);
  return response.data;
}

export async function createStudent(data: ICreateStudentRequest) {
  const response = await api.post("/student", data);
  return response.data;
}

export async function updateStudent({ id, data }: { id: string; data: IUpdateStudentRequest }) {
  const response = await api.patch(`/student/${id}`, data);
  return response.data;
}

export async function deleteStudent(id: string) {
  const response = await api.delete(`/student/${id}`);
  return response.data;
}

export async function importStudents(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await api.post("/student/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
