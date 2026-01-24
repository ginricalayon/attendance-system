import { Departments } from "./enums.schema";
import { z } from "zod";

export const CSVRowSchema = z.object({
  student_number: z.string().min(1, { message: "Student number is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  middle_initial: z
    .string()
    .refine((val) => val === "" || (val.length === 1 && /^[A-Z]$/i.test(val)), {
      message: "Middle initial must be empty or a single letter",
    })
    .transform((val) => val.toUpperCase())
    .optional()
    .default(""),
  department: z.enum(Object.values(Departments) as [string, ...string[]], {
    message: `Department must be one of: ${Object.values(Departments).join(
      ", "
    )}`,
  }),
});

export type CSVRow = z.infer<typeof CSVRowSchema>;
