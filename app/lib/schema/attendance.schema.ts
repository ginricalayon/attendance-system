import { z } from "zod";
import { Departments, EventTypes, OrderBy } from "./enums.schema";

export const AttendanceSchema = z.object({
  event_id: z.string().min(1, { message: "Event ID is required" }),
  settings_id: z.string().min(1, { message: "Settings ID is required" }),
  student_number: z.string().min(1, { message: "Student number is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  middle_initial: z.string().optional(),
  department: z.enum(Departments, { message: "Department is required" }),
  type: z.nativeEnum(EventTypes),
  created_at: z.date(),
  updated_at: z.date(),
});

export type IAttendance = z.infer<typeof AttendanceSchema>;

export const CreateAttendanceRequestSchema = AttendanceSchema.omit({
  event_id: true,
  settings_id: true,
  last_name: true,
  first_name: true,
  middle_initial: true,
  department: true,
  type: true,
  created_at: true,
  updated_at: true,
});

export type ICreateAttendanceRequest = z.infer<
  typeof CreateAttendanceRequestSchema
>;

export const GetAttendancesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort_by: z.string().optional().default("created_at"),
  order_by: z.enum(OrderBy).default(OrderBy.DESC),
  search: z.string().optional(),
  department: z.enum(Departments).optional(),
  type: z.enum(EventTypes).optional(),
});

export type IGetAttendancesQuery = z.infer<typeof GetAttendancesQuerySchema>;
