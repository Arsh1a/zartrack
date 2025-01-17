import { z } from "zod";

export const authenticateSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8).max(32).trim(),
});
export type Authenticate = z.infer<typeof authenticateSchema>;

export const verifyAccountSchema = z.object({
  code: z.string().min(6).max(6).trim(),
});
export type VerifyAccount = z.infer<typeof verifyAccountSchema>;
