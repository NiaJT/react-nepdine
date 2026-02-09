"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";

// ------------------------- 🧠 TYPES ------------------------- //

export type AdditionalUser = {
  full_name: string;
  email: string;
  password: string;
  role: string;
  contact: string;
};

export type CreateRestaurantPayload = {
  restaurant_name: string;
  contact_name: string;
  contact_phone: string;
  location: string;
  website_url: string;
  restaurant_image_url?: string;
  social_links?: Record<string, string>;
  notes?: string;
  additional_user?: AdditionalUser;
};

// ------------------------- ⚙️ MUTATION HOOK ------------------------- //

export const useCreateRestaurant = () => {
  return useMutation({
    mutationFn: async (payload: CreateRestaurantPayload) => {
      const res = await axiosInstance.post("/register/apply", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err) || "Failed to create restaurant");
    },
    onSuccess: () => toast.success("Restaurant created successfully"),
  });
};
