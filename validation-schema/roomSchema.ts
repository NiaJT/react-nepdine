import z from "zod";

export const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  description: z.string().min(1, "Description is required"),
  id: z.string().optional(),
  tenant_id: z.string(),       // required
  restaurant_id: z.string(),   // required
  created_at: z.string().optional(),
  tables: z.array(z.string()).optional(),  
});

export type RoomFormValues = z.infer<typeof roomSchema>;
