import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }).max(255).trim(),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(50, { message: "Password must be less than 50 characters" })
      .trim(),
    password_confirm: z.string().trim(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });
