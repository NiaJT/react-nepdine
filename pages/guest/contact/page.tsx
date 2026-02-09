"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "../../../components/guestComponents/Navbar";
import Footer from "../../../components/guestComponents/Footer";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Poppins } from "next/font/google";
import { Feedback, useAddFeedback } from "@/hooks/useFeedbacks";

// Load font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// ✅ Define Zod schema for validation
const feedbackSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  description: z.string().min(5, "Message must be at least 5 characters"),
});

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { mutate: addFeedback } = useAddFeedback();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
  });

  // ✅ On submit handler
  const onSubmit = async (data: Feedback) => {
    setLoading(true);
    addFeedback(data);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <Navbar />
      
    <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-16 bg-gray-50">
  <div
    className="
      bg-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(251,138,34,0.15)]
      max-w-5xl w-full flex flex-col md:flex-row relative overflow-visible
      origin-top-left
      max-sm:scale-100
    "
  >
    {/* Left side - form */}
    <div className="flex-1 p-3 sm:p-10 flex flex-col justify-start h-full flex-shrink-0 max-sm:scale-90">
      <h1 className="text-lg sm:text-2xl md:text-3xl text-[#FB8A22] font-semibold mb-2 sm:mb-4">
        Get in Touch
      </h1>
      <p className="text-[10px] sm:text-sm md:text-md text-[#222222] font-light mb-3 sm:mb-5">
        Questions, comments, or suggestions? <br />
        Simply fill in the form and we’ll be in touch shortly.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-3 sm:space-y-5 mt-3 sm:mt-5 gap-3 sm:gap-5"
      >
        {/* Name */}
        <div className="flex flex-col">
          <label className="flex items-center text-[#222222] text-xs sm:text-sm mb-1 sm:mb-2 space-x-2 ml-1 sm:ml-2">
            <Icon icon="clarity:avatar-line" className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            {...register("full_name")}
            className="border-2 text-xs sm:text-sm border-[#FB8A22] rounded-lg px-2 sm:px-4 py-1.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#FB8A22]"
          />
          {errors.full_name && (
            <p className="text-red-500 text-xs mt-1 ml-1 sm:ml-2">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="flex items-center text-[#222222] text-xs sm:text-sm mb-1 sm:mb-2 space-x-2 ml-1 sm:ml-2">
            <Icon icon="wpf:message-outline" className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Email</span>
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            {...register("email")}
            className="border-2 border-[#FB8A22] text-xs sm:text-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#FB8A22]"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-1 sm:ml-2">{errors.email.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <label className="flex items-center text-[#222222] text-xs sm:text-sm mb-1 sm:mb-2 space-x-2 ml-1 sm:ml-2">
            <Icon icon="mdi:message-outline" className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="max-sm:text-[10px]">Go ahead, We are listening...</span>
          </label>
          <textarea
            placeholder="Enter your message"
            rows={4}
            {...register("description")}
            className="border-2 border-[#FB8A22] text-xs sm:text-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#FB8A22] resize-none"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1 ml-1 sm:ml-2">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 sm:mt-3 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white font-semibold rounded-full shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer text-xs sm:text-sm"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>

    {/* Right side - Image + Info */}
    <div className="flex-1 flex flex-col items-start p-3 sm:p-6 space-y-2 sm:space-y-4 relative flex-shrink-0 max-sm:scale-90 origin-top-left">
      {/* Illustration */}
      <Image
        src="/contactus.svg"
        alt="Contact illustration"
        width={200}
        height={200}
        className="object-contain w-auto h-auto sm:w-[350px] sm:h-[350px]"
      />

      {/* Address Info */}
      <div className="flex flex-col space-y-2 sm:space-y-4 w-full max-w-xs text-[10px] sm:text-sm">
        {/* Address */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          <div className="flex items-center justify-center w-5 h-5 sm:w-8 sm:h-8 rounded-full border border-[#FB8A22] text-[#FB8A22]">
            <Icon icon="mdi:map-marker" className="w-2.5 h-2.5 sm:w-5 sm:h-5" />
          </div>
          <span>Bhaktapur, Nepal</span>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          <div className="flex items-center justify-center w-5 h-5 sm:w-8 sm:h-8 rounded-full border border-[#FB8A22] text-[#FB8A22]">
            <Icon icon="mdi:phone" className="w-2.5 h-2.5 sm:w-5 sm:h-5" />
          </div>
          <span>01-54321</span>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          <div className="flex items-center justify-center w-5 h-5 sm:w-8 sm:h-8 rounded-full border border-[#FB8A22] text-[#FB8A22]">
            <Icon icon="mdi:email" className="w-2.5 h-2.5 sm:w-5 sm:h-5" />
          </div>
          <span>abcd123@gmail.com</span>
        </div>
      </div>

      {/* Social icons only on small screens */}
      <div className="flex space-x-2 sm:hidden mt-1">
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#FB8A22] text-white cursor-pointer">
          <Icon icon="mdi:facebook" className="w-2.5 h-2.5" />
        </div>
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#FB8A22] text-white cursor-pointer">
          <Icon icon="ri:instagram-fill" className="w-2.5 h-2.5" />
        </div>
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#FB8A22] text-white cursor-pointer">
          <Icon icon="mdi:email" className="w-2.5 h-2.5" />
        </div>
      </div>

      {/* Arrow decoration */}
      <div className="absolute bottom-0 right-0 -mb-3 mr-3 sm:-mb-5 sm:mr-5">
        <Image
          src="/arrow.svg"
          alt="arrow decoration"
          width={120}
          height={120}
          className="object-contain sm:w-[240px] sm:h-[240px] opacity-80"
        />
      </div>
    </div>

    {/* Floating social icons for large screens */}
    <div
      className="hidden sm:flex 
                 absolute bottom-10 -right-11 
                 bg-[#FB8A22] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] 
                 px-3 py-6 flex-col items-center space-y-6 
                 rounded-tr-2xl rounded-br-[80px] h-45 overflow-hidden"
    >
      <Icon
        icon="mdi:facebook"
        className="text-white w-5 h-5 hover:scale-125 transition-transform duration-300 cursor-pointer"
      />
      <Icon
        icon="ri:instagram-fill"
        className="text-white w-5 h-5 hover:scale-125 transition-transform duration-300 cursor-pointer"
      />
      <Icon
        icon="mdi:email"
        className="text-white w-5 h-5 hover:scale-125 transition-transform duration-300 cursor-pointer"
      />
    </div>

    
  </div>


      </main>
      <Footer />
    </div>
  );
} 
