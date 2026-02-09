"use client";

import { useState } from "react";

export default function PlanToggle() {
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="relative inline-flex shadow-lg p-1 rounded-full w-[220px] select-none overflow-hidden ">
      {/* Sliding background */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-[#FB8A22] rounded-full shadow-lg transition-all duration-300 ease-in-out`}
        style={{ transform: plan === "monthly" ? "translateX(0%)" : "translateX(100%)" }}
      />

      {/* Buttons */}
      <button
        onClick={() => setPlan("monthly")}
        className={`relative w-1/2 py-2 text-sm font-medium transition-colors duration-300 ${
          plan === "monthly" ? "text-white" : "text-[#4A4A4A]"
        }`}
      >
        MONTHLY
      </button>
      <button
        onClick={() => setPlan("yearly")}
        className={`relative w-1/2 py-2 text-sm font-medium transition-colors duration-300 ${
          plan === "yearly" ? "text-white" : "text-[#4A4A4A]"
        }`}
      >
        YEARLY
      </button>
    </div>
  );
}
