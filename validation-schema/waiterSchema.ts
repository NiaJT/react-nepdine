import { z } from "zod";

export const waiterSchema = z.object({
    id: z.string(),
  tenant_id: z.string().optional(),
  restaurant_id: z.string().optional(),
  name: z.string().min(1,  "Item name is required"),
  active: z.boolean().default(true),
  rating: z.number().optional(), 
  status: z.string(), 
  contact: z.string(),
  rating__count:z.number().optional()
});

export type WaiterFormValues = z.infer<typeof waiterSchema>;  