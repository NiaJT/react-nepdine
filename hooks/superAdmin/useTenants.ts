"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";

export interface Tenant {
  id: string;
  name: string;
  status: "active" | "inactive";
  owner_name: string;
  owner_contact: string;
  owner_email: string;
  created_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  active: "active" | "inactive";
  created_at: string;
}

export interface User {
  id?: string;
  email: string;
  password?: string;
  full_name: string;
  role: string;
}

export interface OnboardTenantPayload {
  tenant: {
    name: string;
    status: "active" | "inactive";
    owner_name: string;
    owner_contact: string;
    owner_email: string;
    created_at: string;
  };
  restaurant: Restaurant;
  user: User;
}

export const useGetTenants = () => {
  return useQuery<Tenant[], Error>({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/tenants");
      return res.data;
    },
  });
};

export const useGetTenant = (id: string) => {
  return useQuery<Tenant, Error>({
    queryKey: ["tenants", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/tenants/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useAddTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tenant: Partial<Tenant>) => {
      const res = await axiosInstance.post("/tenants", tenant);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tenant created!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Tenant>;
    }) => {
      const res = await axiosInstance.patch(`/tenants/${id}`, values);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tenant updated!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/tenants/${id}`);
    },
    onSuccess: () => {
      toast.success("Tenant deleted!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};

export const useOnboardTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OnboardTenantPayload) => {
      const res = await axiosInstance.post("/tenants/onboard", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tenant onboarded!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
export const useGetTenantRestaurants = (tenantId: string) => {
  return useQuery<Restaurant[], Error>({
    queryKey: ["tenantRestaurants"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/tenants/${tenantId}/restaurants`);
      return res.data;
    },
    enabled: !!tenantId,
  });
};
export const useAddUserToTenant = (tenantId: string) => {
  return useMutation({
    mutationKey: ["tenantAddUser", tenantId],
    mutationFn: async (user: User) => {
      const res = await axiosInstance.post(`/tenants/${tenantId}/users`, user);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User has been added successfully!");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
