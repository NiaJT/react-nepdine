import { axiosInstance } from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";

export const useWaiters = (restaurantId: string) => {
  return useQuery({
    queryKey: ["waiters", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/restaurants/${restaurantId}/waiters`
      );
      return res.data;
    },
  });
};
