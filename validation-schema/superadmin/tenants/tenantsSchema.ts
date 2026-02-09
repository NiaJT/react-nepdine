import z from "zod";

export const onboardTenantSchema = z.object({
  tenant: z.object({
    name: z.string().min(1, { message: "Tenant name is required" }),
    status: z.enum(["active", "inactive"], {
      message: "Please select tenant status",
    }),
    owner_name: z.string().min(1, { message: "Owner name is required" }),
    owner_contact: z.string().min(1, { message: "Owner contact is required" }),
    owner_email: z.email({ message: "Invalid email address" }),
    created_at: z.date(),
  }),
  restaurant: z.object({
    name: z.string().min(1, { message: "Restaurant name is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    active: z.enum(["active", "inactive"], {
      message: "Please select restaurant active status",
    }),
    created_at: z.date(),
  }),
  user: z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    full_name: z.string().min(1, { message: "Full name is required" }),
    role: z.enum(["admin", "chef", "waiter", "accountant"], {
      message: "Please select a role",
    }),
  }),
});
export const tenantSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  status: z.enum(["active", "inactive"], {
    message: "Please select tenant status",
  }),
  owner_name: z.string().min(1, { message: "Owner name is required" }),
  owner_email: z.email({ message: "Invalid email address" }),
  owner_contact: z.string().min(1, { message: "Owner contact is required" }),
  created_at: z.date(),
});
export const addUserToTenantSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  full_name: z.string().min(1, { message: "Full name is required" }),
  role: z.enum(["admin", "chef", "waiter", "accountant"], {
    message: "Please select a role",
  }),
});
