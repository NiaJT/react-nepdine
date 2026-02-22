import type { MyRestaurantResponse } from "@/pages/auth/Restaurants";
import { axiosInstance } from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";

export const useGetMyRestaurants = () => {
  return useQuery<MyRestaurantResponse[], Error>({
    queryKey: ["getMyRestaurants"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurants/my`);
      return res.data;
    },
  });
};
