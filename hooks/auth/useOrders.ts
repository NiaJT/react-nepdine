import { axiosInstance } from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";
import { ordersResponseSchema } from "../../../validation-schema/orderSchema";

export const useOrders = (restaurantId: string) => {
  return useQuery({
    queryKey: ["orders", restaurantId], // use restaurantId as key
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/restaurants/${restaurantId}/orders/with-lines`
      );
      const parsed = ordersResponseSchema.parse(res.data);
      const ordersArray = Array.isArray(parsed) ? parsed : [parsed];
      return ordersArray.flatMap((order) =>
        order.lines.map((line, index) => ({
          id: `${order.id}-${line.menu_item_id}-${index}`,
          table_id: order.table_id,
          quantity: line.quantity,
          waiter_id: line.waiter_id,
          group_id: order.group_id,
          created_at: order.created_at,
          item_id: line.menu_item_id,
          name: line.menu_item_name_snapshot,
          price: Number(line.unit_price_snapshot),
          note: line.note,
        }))
      );
    },
    enabled: !!restaurantId,
  });
};
