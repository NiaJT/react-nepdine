import { z } from "zod";

// schema.ts
export const tableSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  status: z.string(),
  room_id: z.string(),
  description: z.string().optional(),
  restaurant_id: z.string().optional(),
  tenant_id: z.string().optional(),
  current_group_id: z.string().optional(),
  room_name: z.string().optional(),
});

export type TableFormValues = z.infer<typeof tableSchema>;
