import { z } from "zod";

export const balanceItemSchema = z.object({
  group_id: z.string().uuid().optional(),
  group_name: z.string().optional(),
  table_names: z.array(z.string()).optional(),
  waiter_names: z.array(z.string()).optional(),
  subtotal: z.string().optional(),
  discount: z.string().optional(),
  service_charge: z.string().optional(),
  tax: z.string().optional(),
  total: z.string().optional(),
  checks_count: z.number().optional(),
  last_closed_at: z.string().datetime().optional(),
  items: z
    .array(
      z.object({
        name: z.string().optional(),
        quantity: z.number().optional(),
        total_amount: z.string().optional(),
      })
    )
    .optional(),
});

export const balanceResponseSchema = z.object({
  items: z.array(balanceItemSchema).optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  total_items: z.number().optional(),
  total_pages: z.number().optional(),
  aggregate_subtotal: z.string().optional(),
  aggregate_discount: z.string().optional(),
  aggregate_service_charge: z.string().optional(),
  aggregate_tax: z.string().optional(),
  aggregate_total: z.string().optional(),
});

export type BalanceItem = z.infer<typeof balanceItemSchema>;
export type BalanceResponse = z.infer<typeof balanceResponseSchema>;




