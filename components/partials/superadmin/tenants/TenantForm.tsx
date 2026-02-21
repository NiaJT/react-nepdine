"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar24 } from "@/components/ui/date-time-picker";
import { tenantSchema } from "@/validation-schema/superadmin/tenants/tenantsSchema";

export type TenantFormValues = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  tenant?: TenantFormValues & { id?: string };
  onSubmit: (values: TenantFormValues) => void;
  isSubmitting?: boolean;
}

export function TenantForm({
  tenant,
  onSubmit,
  isSubmitting,
}: TenantFormProps) {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: "",
      status: "active",
      owner_name: "",
      owner_email: "",
      owner_contact: "",
      created_at: undefined,
    },
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        ...tenant,
        created_at: tenant.created_at ? new Date(tenant.created_at) : undefined,
        name: tenant.name || "",
        owner_name: tenant.owner_name || "",
        owner_email: tenant.owner_email || "",
        owner_contact: tenant.owner_contact || "",
      });
    }
  }, [tenant, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 border rounded shadow-md bg-white"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Tenant Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status + Created At in one row */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Owner Name + Owner Contact in one row */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="owner_name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Owner Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="owner_contact"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Owner Contact</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Owner Contact"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Owner Email */}
        <FormField
          control={form.control}
          name="owner_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Owner Email"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="created_at"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Created At</FormLabel>
              <FormControl>
                <Calendar24
                  value={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || form.formState.isSubmitting}
        >
          {tenant ? "Update Tenant" : "Add Tenant"}
        </Button>
      </form>
    </Form>
  );
}
