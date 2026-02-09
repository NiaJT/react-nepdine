"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";

export default function OTPPage() {
  const router = useRouter();
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(45);
  const [email, setEmail] = useState<string | null>(null);

  // Redirect if no email
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      router.replace("/register");
      toast.error("No email found. Please register first.");
    } else {
      setEmail(storedEmail);
      inputRefs.current[0]?.focus();
    }
  }, [router]);

  // Timer for resend cooldown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("Text")
      .slice(0, OTP_LENGTH)
      .split("");
    const newOtp = [...otp];
    pasteData.forEach((char, idx) => {
      if (/^[a-zA-Z0-9]$/.test(char)) newOtp[idx] = char.toUpperCase();
    });
    setOtp(newOtp);
    const nextIndex =
      pasteData.length >= OTP_LENGTH ? OTP_LENGTH - 1 : pasteData.length;
    inputRefs.current[nextIndex]?.focus();
  };

  // OTP Verification Mutation
  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("No email found in session.");
      const res = await axiosInstance.post("/register/verify", {
        email,
        code: otp.join(""),
      });
      return res;
    },
    onSuccess: () => {
      toast.success("OTP verified successfully!");
      router.push("/login");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  // Resend OTP Mutation
  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("No email found in session.");
      const res = await axiosInstance.post("/register/resend", { email });
      return res;
    },
    onSuccess: () => {
      toast.success("OTP resent successfully!");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setTimer(45);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err) || "Failed to resend OTP");
    },
  });

  const handleSubmit = () => {
    if (!email) return; // safety
    if (otp.join("").length < OTP_LENGTH) {
      toast.error("Please enter the complete OTP");
      return;
    }
    verifyMutation.mutate();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-4">
      <Image
        src="/otp_bg.svg"
        alt="OTP Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 bg-white/15 backdrop-blur-md p-10 rounded-[50px] shadow-lg w-full max-w-lg h-[500px] text-center flex flex-col justify-center border-3 border-[#BBBBBB]">
        <h1 className="text-2xl font-bold mb-6 text-white mix-blend-overlay drop-shadow-md">
          Please Verify Account
        </h1>

        <p className="text-sm text-white mb-4">
          Enter your six character code that we have sent you
        </p>

        <div className="flex justify-center gap-1 sm:gap-2 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              disabled={!email}
              className="w-10 sm:w-12 h-10 sm:h-12 text-center font-semibold bg-white rounded-lg text-base sm:text-lg focus:outline-none focus:border-[#FB8A22] focus:ring-1 focus:ring-[#FB8A22]"
            />
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!email || otp.includes("") || verifyMutation.isPending}
            className={`w-48 sm:w-64 px-4 py-2 text-sm bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white rounded-lg shadow transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-110 hover:shadow-lg
              ${
                !email || otp.includes("") || verifyMutation.isPending
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify and Continue"}
          </button>
        </div>

        <button
          onClick={() => resendMutation.mutate()}
          disabled={!email || timer > 0 || resendMutation.isPending}
          className="mt-4 text-xs sm:text-sm flex justify-center items-center gap-1 disabled:text-gray-400"
        >
          {timer > 0 ? (
            <span className="text-white">Resend available in {timer}s</span>
          ) : (
            <>
              <span className="text-white">Didn&apos;t receive code?</span>
              <span className="text-[#FB8A22] hover:underline">
                {resendMutation.isPending ? "Resending..." : "Resend it"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
