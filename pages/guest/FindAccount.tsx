"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { ForgotPasswordOtp } from "@/hooks/updatePassword";
import PublicNavbar from "@/components/layout/guest/guestNavbar";

const emailSchema = z.object({
  email: z.email("Please enter a valid email"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function ForgotPasswordEmailPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpMutation = ForgotPasswordOtp();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onSubmit = (data: EmailFormValues) => {
    setIsSubmitting(true);
    otpMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          sessionStorage.setItem("email", data.email);
        },
        onSettled: () => setIsSubmitting(false),
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <PublicNavbar />

      {/* Centered Form */}
      <div className="flex-grow flex items-center justify-center bg-[#f9fafb] px-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            <span className="text-[#FB8A22]">FORGOT </span>
            <span className="text-red-500">PASSWORD</span>
          </h1>
          <p className="text-xs md:text-sm text-[#636364] mb-6 text-center">
            Enter your email to receive a one-time password (OTP) and reset your
            password.
          </p>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FB8A22] to-[#EA454C] cursor-pointer"
                disabled={isSubmitting || otpMutation.isPending}
              >
                {isSubmitting || otpMutation.isPending
                  ? "Sending..."
                  : "Send OTP"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
