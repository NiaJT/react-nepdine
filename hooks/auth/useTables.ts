import { axiosInstance } from "@/lib/axios.instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableFormValues } from "../../../validation-schema/tableSchema";

export const useTables = (restaurantId: string) => {
  return useQuery({
    queryKey: ["tables"],
    enabled: !!restaurantId,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/restaurants/${restaurantId}/tables`
      );
      return res.data;
    },
  });
};
export const useRooms = (restaurantId: string) => {
  return useQuery({
    queryKey: ["rooms"],
    enabled: !!restaurantId,
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurants/${restaurantId}/rooms`);
      return res.data;
    },
  });
};
export const useAddTable = (restaurantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      values: Omit<TableFormValues, "restaurant_id" | "tenant_id"> & {
        room_id: string;
      }
    ) => {
      const restaurant_id = restaurantId;

      const payload = {
        ...values,
        capacity: Number(values.capacity),
        restaurant_id,
      };

      const res = await axiosInstance.post(
        `/restaurants/${restaurant_id}/tables`,
        payload
      );
      return res.data;
    },
    onSuccess: (newTable) => {
      // Push the new table at the end of cache
      queryClient.setQueryData(["tables"], (old: string[] = []) => [
        ...old,
        newTable,
      ]);
    },
  });
};
