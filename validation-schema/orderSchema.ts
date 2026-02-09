import { z } from "zod";

// Schema for individual order line
export const orderLineSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  menu_item_id: z.string(),
  menu_item_name_snapshot: z.string(),
  unit_price_snapshot: z.string(),
  quantity: z.number(),
  note: z.string().optional().nullable(),
  waiter_id: z.string(),
  removed_ingredients: z.array(z.string()).nullable().optional(),
  created_at: z.string(),
});

// Schema for single order
export const orderResponseSchema = z.object({
  id: z.string(),
  table_id: z.string(),
  restaurant_id: z.string(),
  tenant_id: z.string(),
  status: z.string().optional(),
  subtotal: z.string().optional(),
  discount_total: z.string().optional(),
  service_charge: z.string().optional(),
  tax_total: z.string().optional(),
  total: z.string().optional(),
  created_at: z.string(),
  closed_at: z.string().nullable(),
  group_id: z.string().optional(),
  group_name: z.string().optional(),
  lines: z.array(orderLineSchema),
});

export const ordersResponseSchema = z.union([
  z.array(orderResponseSchema),
  orderResponseSchema,
]);

export type OrderResponse = z.infer<typeof orderResponseSchema>;

export const createOrderSchema = z.object({
  restaurant_id: z.string(),
  group_id: z.string().optional(),
  table_id: z.string(),
  items: z.array(
    z.object({
      menu_item_id: z.string(),
      quantity: z.number(),
      waiter_id: z.string(),
  note: z.string().optional().nullable(),
      removed_ingredients: z
        .array(
          z.object({
            name: z.string().optional(),
            default_included: z.boolean(),
          })
        )
        .optional(),
    })
  ),
});

// Type for create order values
export type CreateOrderValues = z.infer<typeof createOrderSchema>;
