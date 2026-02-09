import { z } from "zod";

export const groupSchema = z.object({
  name: z.string().min(1, "group name is required"),
  people_count: z.number().min(1, "people count must be at least 1"),
  id: z.string().optional(),
  tenant_id: z.string().optional(),
  restaurant_id: z.string().optional(),
  table_id: z.string().optional(),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

