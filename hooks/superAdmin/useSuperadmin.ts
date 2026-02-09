import { axiosInstance } from "@/lib/axios.instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SimpleUser } from "./useUsers";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";
import { SuperAdminFormValues } from "@/components/partials/superadmin/superadmin-users/SuperAdminForm";

export const useGetSuperAdminUsers = () => {
  return useQuery<SimpleUser[], Error>({
    queryKey: ["getSuperAdminUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/superadmins`);
      console.log(res.data);
      return res.data;
    },
  });
};
export const useAddSuperAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: SuperAdminFormValues) => {
      const res = await axiosInstance.post(`/admin/superadmins`, user);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User created!");
      queryClient.invalidateQueries({ queryKey: ["getSuperAdminUsers"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
export const useUpdateSuperAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user,
      user_id,
    }: {
      user: SuperAdminFormValues;
      user_id: string;
    }) => {
      const res = await axiosInstance.patch(
        `/admin/superadmins/${user_id}`,
        user
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated!");
      queryClient.invalidateQueries({ queryKey: ["getSuperAdminUsers"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};

export const useDeleteSuperAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user_id: string) => {
      const res = await axiosInstance.delete(`/admin/superadmins/${user_id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted!");
      queryClient.invalidateQueries({ queryKey: ["getSuperAdminUsers"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
