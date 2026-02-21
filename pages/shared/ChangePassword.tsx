"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
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
import { changePasswordSchema } from "@/validation-schema/changePasswordSchema";
import { ChangePassword } from "@/hooks/updatePassword";
import { useUser } from "@/guards/useUser";
import { useRouter } from "./../../lib/useRouter";

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [storedEmail, setStoredEmail] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const sessionEmail =
      typeof window !== "undefined" ? sessionStorage.getItem("email") : null;

    setStoredEmail(user?.email || sessionEmail || "");
  }, [user]);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePassword = ChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    if (!storedEmail) {
      toast.error("Email not found. Please log in again.");
      return;
    }
    changePassword.mutate({ ...data, email: storedEmail });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      {/* Centered Form */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
          {/* Title */}
          {/* Title */}
          <div className="flex items-center justify-center mb-2">
            <button
              onClick={() => router.replace("/")}
              className="text-[#FB8A22] text-xl font-bold hover:text-[#ea454c] transition-colors mr-3 pointer-cursor"
            >
              &lt;
            </button>
            <h1 className="text-3xl font-bold text-center">
              <span className="text-[#FB8A22]">CHANGE </span>
              <span className="text-red-500">PASSWORD</span>
            </h1>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Display stored email */}
              {storedEmail ? (
                <div className="mb-4">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        value={storedEmail}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </FormControl>
                  </FormItem>
                </div>
              ) : (
                <p className="text-gray-400 mb-4 text-center">
                  Loading email...
                </p>
              )}
              {/* Old Password */}
              <FormField
                control={form.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        >
                          {showOldPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        >
                          {showNewPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FB8A22] to-[#EA454C] mt-2 cursor-pointer"
                disabled={changePassword.isPending}
              >
                {changePassword.isPending ? "Updating..." : "Change Password"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
