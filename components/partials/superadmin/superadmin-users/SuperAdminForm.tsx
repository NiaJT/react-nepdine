"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";

import {
  useAddSuperAdmin,
  useUpdateSuperAdmin,
} from "@/hooks/superAdmin/useSuperadmin";

const superAdminSchema = z.object({
  id: z.string().optional(),
  email: z.email("Please enter a valid email address"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SuperAdminFormValues = z.infer<typeof superAdminSchema>;

interface SuperAdminFormProps {
  defaultValues?: Partial<SuperAdminFormValues>;
  onClose: () => void; // closes the dialog
  userId?: string; // optional, if editing
}

export function SuperAdminForm({
  defaultValues,
  onClose,
  userId,
}: SuperAdminFormProps) {
  const addSuperAdmin = useAddSuperAdmin();
  const updateSuperAdmin = useUpdateSuperAdmin();

  const form = useForm<SuperAdminFormValues>({
    resolver: zodResolver(superAdminSchema),
    defaultValues: defaultValues || { email: "", full_name: "", password: "" },
  });

  const handleSubmit = (values: SuperAdminFormValues) => {
    if (userId) {
      // update
      updateSuperAdmin.mutate(
        { user: values, user_id: userId },
        { onSuccess: onClose }
      );
    } else {
      // create
      addSuperAdmin.mutate(values, { onSuccess: onClose });
    }
  };

  const isSubmitting = addSuperAdmin.isPending || updateSuperAdmin.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
