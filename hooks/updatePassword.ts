import { useMutation } from "@tanstack/react-query";
import {
  changePasswordSchema,
  forgotPasswordSchema,
} from "../../validation-schema/changePasswordSchema";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";
import z from "zod";
import { useLogout } from "./logout";
import { useRouter } from "next/navigation";
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
type ChangePasswordPayload = ChangePasswordFormValues & {
  email: string;
};
type ResetPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordPayload = ResetPasswordFormValues & { email: string };
export const ChangePassword = () => {
  const { mutate: logout } = useLogout();
  const mutation = useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (values: ChangePasswordPayload) => {
      const res = await axiosInstance.post("/auth/change-password", values);
      return res;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      logout();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
  return mutation;
};
export const ForgotPasswordOtp = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationKey: ["otp-forgotPassword"],
    mutationFn: async (values: { email: string }) => {
      const res = await axiosInstance.post("/auth/forgot-password", values);
      return res;
    },
    onSuccess: () => {
      toast.success("Otp sent successfully");
      router.replace("/forgot-password");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
  return mutation;
};
export const ResetPassword = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (values: ResetPasswordPayload) => {
      const res = await axiosInstance.post("/auth/reset-password", values);
      return res;
    },
    onSuccess: () => {
      toast.success("Password has been reset successfully");
      sessionStorage.clear();
      router.replace("/login");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err) || "Failed to reset password");
    },
  });
  return mutation;
};
