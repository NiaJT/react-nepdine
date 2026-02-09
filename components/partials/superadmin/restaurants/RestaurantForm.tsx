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
import { useGetTenants, Tenant } from "@/hooks/superAdmin/useTenants";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams } from "next/navigation";

export const restaurantSchema = z.object({
  tenant_id: z.uuid("Select a valid tenant"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().optional(),
  active: z.enum(["active", "inactive"]),
  created_at: z.date(),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
interface RestaurantFormProps {
  restaurant?: RestaurantFormValues & { id?: string };
  onSubmit: (values: RestaurantFormValues) => void;
  isSubmitting?: boolean;
}

export function RestaurantForm({
  restaurant,
  onSubmit,
  isSubmitting,
}: RestaurantFormProps) {
  const params = useParams();
  const id = params.id as string;
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      tenant_id: id ? id : "",
      name: "",
      location: "",
      active: "active",
      created_at: new Date(),
    },
  });

  const { data: tenants = [] } = useGetTenants();

  useEffect(() => {
    if (restaurant) {
      form.reset({
        ...restaurant,
        created_at: restaurant.created_at
          ? new Date(restaurant.created_at)
          : new Date(),
      });
    }
  }, [restaurant, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 border rounded shadow-md bg-white"
      >
        {/* Tenant Selector */}
        {!id && (
          <FormField
            control={form.control}
            name="tenant_id"
            render={({ field }) => {
              const selectedTenant = tenants.find(
                (t) => t.id === field.value
              )?.name;
              return (
                <FormItem>
                  <FormLabel>Tenant</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full text-left">
                        {selectedTenant || "Select Tenant"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search tenant..." />
                        <CommandList>
                          <CommandEmpty>No tenants found.</CommandEmpty>
                          <CommandGroup>
                            {tenants.map((tenant: Tenant) => (
                              <CommandItem
                                key={tenant.id}
                                onSelect={() => field.onChange(tenant.id)}
                              >
                                {tenant.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        {/* Restaurant Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter restaurant name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter location" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active */}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select {...field} className="w-full border rounded px-2 py-1">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Created At */}
        <FormField
          control={form.control}
          name="created_at"
          render={({ field }) => (
            <FormItem>
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
          {restaurant ? "Update Restaurant" : "Add Restaurant"}
        </Button>
      </form>
    </Form>
  );
}
