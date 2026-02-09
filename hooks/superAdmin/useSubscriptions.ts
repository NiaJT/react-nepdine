"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";

// -------------------------
// Type Definitions
// -------------------------
export interface SubscriptionFeature {
  feature_id: string;
  enabled: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  created_at: string;
  features: SubscriptionFeature[];
}

// ✅ Fetch all subscriptions
export const useGetSubscriptions = () => {
  return useQuery<Subscription[], Error>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/subscriptions");
      return res.data;
    },
  });
};

// ✅ Create new subscription
export const useAddSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscription: {
      name: string;
      description: string;
      is_default: boolean;
      features: SubscriptionFeature[];
    }) => {
      const res = await axiosInstance.post("/subscriptions", subscription);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription created!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};

// ✅ Update existing subscription
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscription_id,
      subscription,
    }: {
      subscription_id: string;
      subscription: {
        name: string;
        description: string;
        is_default: boolean;
        features: SubscriptionFeature[];
      };
    }) => {
      const res = await axiosInstance.patch(
        `/subscriptions/${subscription_id}`,
        subscription
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription updated!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};

// ✅ Delete a subscription
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/subscriptions/${id}`);
    },
    onSuccess: () => {
      toast.success("Subscription deleted!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
