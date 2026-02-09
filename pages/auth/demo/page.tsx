"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Utensils, Users, Rocket, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useLogout } from "@/hooks/logout";

export default function DemoPage() {
  const router = useRouter();

  const { mutate: handleLogout, isPending } = useLogout();

  const features = [
    {
      icon: <Utensils className="w-7 h-7 text-[#EA454C]" />,
      title: "Manage Menus & Orders",
      desc: "Create and update restaurant menus, and track every order in real time with ease.",
    },
    {
      icon: <Users className="w-7 h-7 text-[#FB8A22]" />,
      title: "Collaborate with Your Team",
      desc: "Invite your staff and manage roles easily — waiters, chefs, or managers.",
    },
    {
      icon: <Rocket className="w-7 h-7 text-[#EA454C]" />,
      title: "Grow with NepDine",
      desc: "Boost your visibility and connect with thousands of food lovers across Nepal.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f9fafb] overflow-hidden px-6">
      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="absolute top-6 right-6"
      >
        <Button
          onClick={() => handleLogout()}
          variant="outline"
          className={`flex items-center gap-2 border-[#EA454C] text-[#EA454C] hover:bg-red-50 hover:border-[#FB8A22] ${
            isPending ? "cursor-not-allowed z-10" : "cursor-pointer"
          }`}
        >
          <LogOut className="w-4 h-4" />
          {isPending ? "Logging Out" : "Log Out"}
        </Button>
      </motion.div>

      {/* Top Right Image */}
      <div className="absolute top-0 right-0 pointer-events-none select-none overflow-hidden hidden md:block">
        <Image
          width={300}
          height={300}
          src="/restaurant_decor/fork.png"
          alt="decor"
          className="object-cover"
        />
      </div>

      {/* Bottom Left Image */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none overflow-hidden hidden md:block">
        <Image
          src="/restaurant_decor/chef.png"
          alt="decor"
          height={300}
          width={300}
          className="object-contain"
        />
      </div>

      {/* Main Content Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center max-w-6xl w-full"
      >
        {/* Title Section */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="text-[#FB8A22]">WELCOME</span> TO{" "}
            <span className="text-red-500">NEP</span>
            <span className="text-[#FB8A22]">DINE</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            You’re almost ready to begin your journey with NepDine — where
            restaurants grow smarter and diners connect better.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-center">
          {features.map((f, i) => (
            <Card
              key={i}
              className="rounded-[25px] bg-white shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 border border-gray-100"
            >
              <CardHeader className="flex flex-col items-center justify-center space-y-3 pt-6">
                <div className="bg-gradient-to-r from-[#F3A305] to-[#EA454C] p-4 rounded-full">
                  {React.cloneElement(f.icon, { className: "text-white" })}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 text-center text-gray-600 text-sm">
                {f.desc}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button
            onClick={() => router.push("/restaurants/create")}
            className="bg-gradient-to-r from-[#F3A305] to-[#EA454CE5] text-white rounded-3xl text-lg px-8 py-6 w-[240px] hover:scale-105 hover:shadow-lg transition-all"
          >
            Start a Restaurant
          </Button>
        </div>

        {/* Footer Text */}
        <p className="mt-12 text-gray-500 text-sm text-center">
          Empowering restaurants across Nepal —{" "}
          <span className="text-[#EA454C] font-semibold">NepDine</span>
        </p>
      </motion.div>
    </div>
  );
}
