import { axiosInstance } from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";

export const useMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ["Menu"],
    enabled: !!restaurantId,
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurants/${restaurantId}/menu`);
      return res.data;
    },
  });
};
