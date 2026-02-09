"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";
export interface Feature {
  id: string;
  key: string;
  name: string;
  description: string;
  default_enabled: boolean;
  created_at: string;
}

export const useGetFeatures = () => {
  return useQuery<Feature[], Error>({
    queryKey: ["features"],
    queryFn: async () => {
      const res = await axiosInstance.get("/features");
      return res.data;
    },
  });
};

export const useAddFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feature: {
      key: string;
      name: string;
      default_enabled: boolean;
      description?: string;
    }) => {
      const res = await axiosInstance.post(`/features`, feature);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Feature created!");
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};

export const useUpdateFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      feature_id,
      feature,
    }: {
      feature_id: string;
      feature: {
        key: string;
        name: string;
        default_enabled: boolean;
        description?: string;
      };
    }) => {
      const res = await axiosInstance.patch(`/features/${feature_id}`, feature);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Feature updated!");
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};

export const useDeleteFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/features/${id}`);
    },
    onSuccess: () => {
      toast.success("Feature deleted!");
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
