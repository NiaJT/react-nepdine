"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "./../../lib/useRouter";

import toast from "react-hot-toast";
import Image from "@/components/ui/image";

import { Eye, EyeOff } from "lucide-react";
import { loginSchema } from "../../../../validation-schema/loginSchema";
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
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  ApiError,
  getApiErrorMessage,
} from "@/lib/types/globalTypes/api-response";
import { useUser } from "@/components/guards/UserContext";
import { GoogleLogin } from "@react-oauth/google";
type LoginFormValues = z.infer<typeof loginSchema>;
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLoginSuccess = async () => {
    const updatedUser = await refreshUser();
    if (updatedUser?.is_superadmin) router.replace("/superadmin/tenants");
    else router.replace("/restaurants");
  };

  const { mutateAsync: login, isPending } = useMutation({
    mutationKey: ["Login"],
    mutationFn: async (values: LoginFormValues) => {
      setEmail(values.email);
      const res = await axiosInstance.post("/auth/login", values);
      return res.data;
    },
    onError: (err: ApiError) => {
      toast.error(getApiErrorMessage(err));
      if (err?.response?.status === 403) {
        sessionStorage.setItem("email", email);
        router.replace("/change-password");
      }
    },
    onSuccess: handleLoginSuccess,
  });
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const { refreshUser } = useUser();

  const onSubmit = async (values: LoginFormValues) => {
    await login(values);
  };

  if (isPending) {
    <LoadingSpinner />;
  }
  return (
    <div className="flex flex-col md:flex-row min-h-[auto] md:min-h-screen">
      {/* Form */}
      <div className="w-full justify-center md:w-[40%] flex flex-col items-center bg-[#f9fafb] p-4 md:p-8 rounded-tl-2xl rounded-bl-2xl overflow-y-auto">
        <div className="max-w-sm mx-auto">
          {/* Logo + Back Button */}
          <div className="relative md:mb-6 flex items-center justify-center">
            <Image
              src="/nepdineFull.png"
              alt="Logo illustration"
              width={242.05}
              height={101.91}
              className="object-contain "
            />
          </div>

          {/* Title & Small Saying */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            <span className="text-[#FB8A22]">WELCOME </span>BACK
          </h1>
          <p className="text-xs md:text-sm text-[#636364] mb-4 md:mb-6 text-center">
            Welcome back! Please enter your details.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Email */}
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
              {/* Password */}
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
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        >
                          {showPassword ? (
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
              {/* Forgot password */}
              <div className="flex items-center justify-between text-xs">
                <span
                  onClick={() => router.push("/find-account")}
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FB8A22] to-[#EA454C] cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
              {/* OR separator */}
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-500 text-xs">or</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <div className="w-full">
                {/* Google sign-in button */}
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      await axiosInstance.post("/auth/google", {
                        id_token: credentialResponse.credential,
                      });
                      await handleLoginSuccess();
                    } catch (err) {
                      toast.error("Google login failed");
                      console.error(err);
                    }
                  }}
                  onError={() => toast.error("Google login failed")}
                />
              </div>
              {/* Sign up link */}
              <p className="text-center text-xs mt-4">
                Don’t have an account?{" "}
                <span
                  onClick={() => router.push("/register")}
                  className="text-[#FB8A22] font-medium hover:underline cursor-pointer hover:text-[#2a2f4a] transition-colors duration-200 "
                >
                  Sign up
                </span>
              </p>
            </form>
          </Form>
        </div>
      </div>

      {/* Right Image */}
      <div className="hidden md:block w-[60%] relative">
        <Image
          src="/login_img_burger1.png"
          alt="Login illustration"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
