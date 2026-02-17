// hooks/useLogout.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { useRouter } from "./../../lib/useRouter";

import toast from "react-hot-toast";
import { useUser } from "@/components/guards/UserContext";

export const useLogout = () => {
  const router = useRouter();
  const { logout } = useUser();
  const mutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post("/auth/logout");
    },
    onSuccess: async () => {
      await logout();
      sessionStorage.clear();
      localStorage.removeItem("restaurant_id");
      toast.success("Logged out successfully!");
      router.replace("/login");
    },
    onError: () => {
      toast.error("Logout failed. Try again.");
    },
  });

  return mutation;
};
