import z from "zod";

export const changePasswordSchema = z
  .object({
    old_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .trim(),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .trim(),
    confirm_password: z.string().min(8, "Confirm your password").trim(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });
export const forgotPasswordSchema = z
  .object({
    code: z.string().min(6, "OTP must be at least 6 characters").trim(),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .trim(),
    confirm_password: z.string().min(8, "Confirm your password").trim(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });
