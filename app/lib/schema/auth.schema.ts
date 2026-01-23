import { z } from "zod";

export const LoginSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
});

export type ILoginRequest = z.infer<typeof LoginSchema>;
