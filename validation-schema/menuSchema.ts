import { string, z } from "zod";

export const menuSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)), { message: "Price must be a valid number" }),
  category: z.string().min(1, "Category is required"),
  image: z.union([z.string().url(), z.string().length(0)]).optional(),
  active: z.boolean(),
  id: z.string().optional(),
  tenant_id: z.string().optional(),
  restaurant_id: z.string().optional(),
  ingredients: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        default_included: z.boolean().default(true).optional(),
      })
    )
    .optional(),
});

export type MenuFormValues = z.infer<typeof menuSchema>;