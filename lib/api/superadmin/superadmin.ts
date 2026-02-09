import { axiosInstance } from "@/lib/axios.instance";

// TENANTS
export const getTenants = async () => {
  const res = await axiosInstance.get("/tenants/");
  return res.data;
};

export const getTenant = async (id: string) => {
  const res = await axiosInstance.get(`/tenants/${id}`);
  return res.data;
};

export const createTenant = async (payload: { name: string }) => {
  const res = await axiosInstance.post("/tenants/", payload);
  return res.data;
};

export const onboardTenant = async (payload: {
  tenant: { name: string };
  restaurant: { name: string; location: string };
  user: { email: string; password: string; full_name: string };
}) => {
  const res = await axiosInstance.post("/tenants/onboard", payload);
  return res.data;
};
