import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email").nonempty("Email is required").trim(),
  password: z.string().min(8, "Password must be at least 8 characters").trim(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
