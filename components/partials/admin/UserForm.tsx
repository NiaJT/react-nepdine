"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAddUserToRestaurant } from "@/hooks/superAdmin/useUsers";

const formSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  contact: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  role: string;
  restaurantId: string;
}

export default function UserForm({ role, restaurantId }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      contact: "",
      email: "",
      password: "",
    },
  });

  const addUserMutation = useAddUserToRestaurant(restaurantId);

  const onSubmit = async (data: FormData) => {
    const payload = {
      full_name: data.full_name,
      contact: data.contact,
      email: data.email,
      password: data.password,
      role: role.toLowerCase(),
    };

    addUserMutation.mutate(payload, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full w-full space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter full name"
                    {...field}
                    className="h-12 text-base w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone"
                    {...field}
                    className="h-12 text-base w-full"
                  />
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
                  <Input
                    placeholder="Enter email"
                    type="email"
                    {...field}
                    className="h-12 text-base w-full"
                  />
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...field}
                      className="h-12 text-base w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Fixed Role Field */}
          <div className="sm:col-span-2 w-[1/2]">
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input
                  value={role}
                  readOnly
                  disabled
                  className="h-12 text-base w-full max-w-[200px] bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </FormControl>
            </FormItem>
          </div>
        </div>

        <Button
          type="submit"
          disabled={addUserMutation.isPending}
          className="w-[185px] h-[42px] bg-gradient-to-r from-[#FB8A22] to-[#EA454CE5] text-white"
        >
          {addUserMutation.isPending ? "Adding..." : `Add ${role}`}
        </Button>
      </form>
    </Form>
  );
}
