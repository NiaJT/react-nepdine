"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddUserToTenant } from "@/hooks/superAdmin/useTenants";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUserToTenantSchema } from "@/validation-schema/superadmin/tenants/tenantsSchema";
import z from "zod";
import { useParams } from "react-router-dom";
import type { User } from "@/hooks/superAdmin/useTenants";

type AddUserFormValues = z.infer<typeof addUserToTenantSchema>;
export function AddUserForm() {
  const params = useParams();
  const tenantId = params.id as string;
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserToTenantSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "admin",
    },
    mode: "onTouched",
  });

  const mutation = useAddUserToTenant(tenantId);

  const submit = (values: User) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="space-y-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold">Add User to Tenant</h3>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Name */}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="waiter">Waiter</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
