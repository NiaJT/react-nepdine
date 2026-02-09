"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "@/components/ui/image";

import { Eye, EyeOff } from "lucide-react";
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
import { registerSchema } from "../../../../validation-schema/registerSchema";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "@/components/guards/UserContext";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const { refreshUser } = useUser();
  const handleLoginSuccess = async () => {
    const updatedUser = await refreshUser();
    if (updatedUser?.is_superadmin) router.replace("/superadmin/tenants");
    else router.replace("/restaurants");
  };
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      password_confirm: "",
    },
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationKey: ["register-tenant"],
    mutationFn: async (values: RegisterFormValues) => {
      const res = await axiosInstance.post("/register/start", values);
      return res;
    },
    onSuccess: () => {
      toast.success("Verification code sent to your email");
      sessionStorage.setItem("email", email);
      router.push("/otp");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const onSubmit = (data: RegisterFormValues) => {
    setEmail(data.email);
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[auto] md:min-h-screen">
      {/* Form Section */}
      <div className="w-full md:w-[40%] flex flex-col justify-start bg-[#f9fafb] p-4 md:p-8 rounded-tl-2xl rounded-bl-2xl overflow-y-auto relative">
        <div className="max-w-sm mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 text-[#FB8A22] text-xl font-bold hover:text-[#ea454c] transition-colors"
          >
            &lt;
          </button>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center mt-8">
            <span className="text-[#FB8A22]">WELCOME </span>TO <br />
            <span className="text-red-500">NEP</span>DINE
          </h1>
          <p className="text-xs md:text-sm text-[#636364] mb-4 md:mb-6 text-center">
            Your appetite deserves VIP access <br /> — join our community today!
          </p>

          {/* Form */}
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

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Choose a username"
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

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="password_confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FB8A22] to-[#EA454C] cursor-pointer"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Registering..." : "Register"}
              </Button>

              {/* OR separator */}
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-500 text-xs">or</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Google Login */}
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    await axiosInstance.post("/auth/google", {
                      id_token: credentialResponse.credential,
                    });
                    await handleLoginSuccess();
                    toast.success("Register Successful! Logging In");
                  } catch (err) {
                    toast.error("Google login failed");
                    console.error(err);
                  }
                }}
                onError={() => toast.error("Google login failed")}
              />

              <p className="text-center text-xs mt-4">
                Already have an account?{" "}
                <span
                  onClick={() => router.push("/login")}
                  className="text-[#FB8A22] font-medium hover:underline cursor-pointer hover:text-[#2a2f4a] transition-colors duration-200"
                >
                  Log in
                </span>
              </p>
            </form>
          </Form>
        </div>
      </div>

      {/* Right Image */}
      <div className="hidden md:block w-[60%] relative">
        <Image
          src="/register_img_pizza.png"
          alt="Register illustration"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
