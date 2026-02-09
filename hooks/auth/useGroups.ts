import { axiosInstance } from "@/lib/axios.instance";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";
import { Group } from "@/lib/types/globalTypes/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
export const useGroupsList = (restaurantId: string) => {
  return useQuery<Group[]>({
    queryKey: ["getGroupList"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/restaurants/${restaurantId}/groups`
      );
      return res.data;
    },
  });
};
export const useGroup = (restaurantId: string, groupId: string) => {
  return useQuery<Group>({
    queryKey: ["getGroup"],
    queryFn: async () => {
      const res = await axiosInstance(
        `/restaurants/${restaurantId}/groups/${groupId}`
      );
      return res.data;
    },
  });
};
export const useAddGroup = (restaurantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createGroup"],
    mutationFn: async (
      values: Omit<Group, "id" | "tenant_id" | "opened_at"> & {
        table_ids: string[];
      }
    ) => {
      const res = await axiosInstance.post(
        `/restaurants/${restaurantId}/groups`,
        values
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Group Added successfully!");
      queryClient.invalidateQueries({ queryKey: ["getGroupList"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
export const useUpdateGroup = (restaurantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateGroup"],
    mutationFn: async (
      values: Omit<Group, "tenant_id" | "opened_at"> & {
        table_ids: string[];
      }
    ) => {
      const res = await axiosInstance.patch(
        `/restaurants/${restaurantId}/groups/${values.id}`,
        values
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Group Updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["getGroupList"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
export const useDeleteGroup = (restaurantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["DeleteGroup"],
    mutationFn: async (group_id: string) => {
      const res = await axiosInstance.delete(
        `/restaurants/${restaurantId}/groups/${group_id}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Group deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["getGroupList"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
};
export type GroupBillOrder = {
  group_id: string;
  table_id: string;
  id: string;
  tenant_id: string;
  restaurant_id: string;
  status: string;
  subtotal: string;
  discount_total: string;
  service_charge: string;
  tax_total: string;
  total: string;
  created_at: string;
  closed_at: string;
  room_name: string;
  table_name: string;
};

export type GroupBill = {
  subtotal: string;
  discount_total: string;
  service_charge: string;
  tax_total: string;
  total: string;
  orders: GroupBillOrder[];
};

export const useGetGroupBill = (restaurantId: string, groupId: string) => {
  return useQuery<GroupBill, Error>({
    queryKey: ["getGroupBill", restaurantId, groupId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/restaurants/${restaurantId}/groups/${groupId}/bill`
      );
      return res.data;
    },
  });
};
export const useCheckoutGroup = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["checkoutGroup"],
    mutationFn: async ({
      groupId,
      discount,
      service_charge,
      tax,
      total_final,
    }: {
      groupId: string;
      discount: number;
      service_charge: number;
      tax: number;
      total_final: number;
    }) => {
      const res = await axiosInstance.post(
        `/restaurants/${restaurantId}/groups/${groupId}/checkout`,
        { discount, service_charge, tax, total_final }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Group successfully checked out!");
      queryClient.invalidateQueries({ queryKey: ["getGroupList"] });
      queryClient.invalidateQueries({ queryKey: ["getGroup"] });
      queryClient.invalidateQueries({ queryKey: ["orders", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["getGroupBill"] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
};
