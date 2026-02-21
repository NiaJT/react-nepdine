import { z } from "zod";

export const restaurantSchema = z.object({
  tenant_id: z.uuid("Select a valid tenant"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().optional(),
  active: z.enum(["active", "inactive"]),
  created_at: z.date(),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
