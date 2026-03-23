import { z } from "zod";

export const LoginSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  remember_me: z.boolean().optional().default(false),
});

export type ILoginRequest = z.infer<typeof LoginSchema>;
