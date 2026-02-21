import { z } from "zod";
import { emailSchema } from "../common/base";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
  remember_me: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
