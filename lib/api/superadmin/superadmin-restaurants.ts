import { axiosInstance } from "@/lib/axios.instance";

// RESTAURANTS

export const getRestaurants = async () => {
  const res = await axiosInstance.get("/restaurants");
  return res.data;
};

export const getRestaurant = async (id: string) => {
  const res = await axiosInstance.get(`/restaurants/${id}`);
  return res.data;
};

export const createRestaurant = async (payload: {
  name: string;
  location: string;
  active: boolean;
}) => {
  const res = await axiosInstance.post("/restaurants", payload);
  return res.data;
};

export const updateRestaurant = async (
  id: string,
  payload: { name?: string; location?: string; active?: boolean }
) => {
  const res = await axiosInstance.patch(`/restaurants/${id}`, payload);
  return res.data;
};

export const deleteRestaurant = async (id: string) => {
  const res = await axiosInstance.delete(`/restaurants/${id}`);
  return res.data;
};
