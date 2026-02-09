import { axiosInstance } from "@/lib/axios.instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";
import { User } from "../superAdmin/useTenants";
export interface ProvidedUser {
  id: string;
  restaurant_id: string;
  user_id: string;
  role: string;
  created_at: string;
  user: SimpleUser;
  contact: string;
}
export interface SimpleUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  is_active: "active" | "inactive";
  is_superadmin: boolean;
  must_change_password: boolean;
  role: string;
}
export const useGetRestaurantUsers = (restaurantId: string) => {
  return useQuery<ProvidedUser[], Error>({
    queryKey: ["getRestaurantUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurants/${restaurantId}/users`);
      console.log(res.data);
      return res.data;
    },
    enabled: !!restaurantId,
  });
};
export const useAddUserToRestaurant = (restaurantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      const res = await axiosInstance.post(
        `/restaurants/${restaurantId}/users`,
        user
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("User created!");
      queryClient.invalidateQueries({ queryKey: ["getRestaurantUsers"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
export const useDeleteUserFromRestaurant = (restaurantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await axiosInstance.delete(
        `/restaurants/${restaurantId}/users/${userId}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["getRestaurantUsers"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};

export const useEditUserToRestaurant = (restaurantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      const res = await axiosInstance.patch(
        `/admin/restaurants/${restaurantId}/users/${user.id}`,
        user
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("User has been updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["getRestaurantUsers"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
