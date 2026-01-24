import { z } from "zod";
import { Departments, OrderBy } from "./enums.schema";

export const StudentSchema = z.object({
  student_number: z.string().min(1, { message: "Student number is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  middle_initial: z
    .string()
    .refine((val) => val === "" || (val.length === 1 && /^[A-Z]$/.test(val)), {
      message: "Middle initial must be empty or a single uppercase letter",
    })
    .optional(),
  department: z.enum(Departments, { message: "Department is required" }),
  barcode: z.string().min(1, { message: "Barcode is required" }),
});

export type IStudentRequest = z.infer<typeof StudentSchema>;

export const CreateStudentRequestSchema = StudentSchema.omit({
  barcode: true,
});

export type ICreateStudentRequest = z.infer<typeof CreateStudentRequestSchema>;

export const GetStudentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort_by: z.string().optional().default("created_at"),
  order_by: z.enum(OrderBy).default(OrderBy.DESC),
  search: z.string().optional(),
  department: z.enum(Departments).optional(),
});

export type IGetStudentsQuery = z.infer<typeof GetStudentsQuerySchema>;

export const StudentIdSchema = z
  .string()
  .min(1, { message: "Student ID is required" });

export type IStudentId = z.infer<typeof StudentIdSchema>;

export const GetStudentQuerySchema = z.object({
  student_id: StudentIdSchema,
});

export type IGetStudentQuery = z.infer<typeof GetStudentQuerySchema>;

export const UpdateStudentRequestSchema = StudentSchema.partial().omit({
  barcode: true,
});

export type IUpdateStudentRequest = z.infer<typeof UpdateStudentRequestSchema>;

export const UpdateStudentQuerySchema = z.object({
  student_id: StudentIdSchema,
});

export type IUpdateStudentQuery = z.infer<typeof UpdateStudentQuerySchema>;

export const DeleteStudentQuerySchema = z.object({
  student_id: StudentIdSchema,
});

export type IDeleteStudentQuery = z.infer<typeof DeleteStudentQuerySchema>;
