import { z } from "zod";

export const menuIngredientsSchema = z.object({
  restaurant_id: z.string().optional(),
  menu_item_id: z.string().optional(),
  name: z.string(),
  default_included: z.boolean(),
  id: z.string().optional(),
  tenant_id: z.string().optional(),
  tenant_ingredient_id: z.string().optional(),
  master_id: z.string().optional(),
  canonical_name: z.string().optional(),
  display_name: z.string().optional(),
  image_url: z.string().optional(),
});

export type MenuIngredientFormValues = z.infer<typeof menuIngredientsSchema>;
