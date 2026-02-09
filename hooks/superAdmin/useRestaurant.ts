"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";

export interface Restaurant {
  id: string;
  tenant_id: string;
  name: string;
  location: string;
  active: "active" | "inactive";
  created_at: string;
}

// ✅ Fetch all restaurants
export const useGetRestaurants = () => {
  return useQuery<Restaurant[], Error>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/restaurants");
      return res.data;
    },
  });
};

// ✅ Fetch single restaurant
export const useGetRestaurant = (id: string) => {
  return useQuery<Restaurant, Error>({
    queryKey: ["restaurants", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurants/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// ✅ Add restaurant
export const useAddRestaurant = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (restaurant: Partial<Restaurant>) => {
      const res = await axiosInstance.post(
        `/restaurants/tenant/${tenantId}`,
        restaurant
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Restaurant created!");
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
    onError: () => toast.error("Failed to create restaurant"),
  });
};

// ✅ Update restaurant
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Restaurant>;
    }) => {
      const res = await axiosInstance.patch(`/restaurants/${id}`, values);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Restaurant updated!");
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["tenantRestaurants"] });
    },
    onError: () => toast.error("Failed to update restaurant"),
  });
};

// ✅ Delete restaurant
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/restaurants/${id}`);
    },
    onSuccess: () => {
      toast.success("Restaurant deleted!");
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
    onError: () => toast.error("Failed to delete restaurant"),
  });
};
