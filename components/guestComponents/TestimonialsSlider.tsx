"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function TestimonialsSlider() {
  const testimonials = [
    {
      img: "/john.svg",
      name: "John Raj Shrestha",
      role: "CEO, Bhojan Restaurant",
      text: "This restaurant management system has completely changed how we run operations. From table management to billing, everything is smooth and efficient.",
    },
    {
      img: "/ram.svg",
      name: "Ram Bdr Poudel",
      role: "CEO, Falcha Kitchen",
      text: "As a restaurant owner, I can confidently say this system has streamlined every part of our operations. From reservations to real-time reporting, it keeps everything in one place.",
    },
    {
      img: "/sushma.svg",
      name: "Sushma Shrestha",
      role: "Owner, Nesara Restaurant",
      text: "Our workflow has improved tremendously. The billing automation and easy data tracking have saved us hours every week.",
    },
  ];

  const [cards, setCards] = useState(testimonials);

  const handleNext = () => setCards((prev) => [...prev.slice(1), prev[0]]);
  const handlePrev = () => setCards((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);

  return (
    <div className="relative w-full flex justify-center items-center py-24 overflow-visible mb-5 ">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 bg-[#FB8A22] text-white p-4 rounded-full shadow-lg hover:bg-[#e67815] transition z-30"
      >
        <Icon icon="material-symbols:chevron-left" width={28} height={28} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 bg-[#FB8A22] text-white p-4 rounded-full shadow-lg hover:bg-[#e67815] transition z-30"
      >
        <Icon icon="material-symbols:chevron-right" width={28} height={28} />
      </button>

      {/* Cards container */}
      <div className="flex justify-center items-center gap-6 lg:gap-20 overflow-visible w-full max-w-6xl px-4 ">
        {cards.map((t, i) => {
          // Large screen: middle card is enlarged
          const scale = i === 1 ? "scale-105 md:scale-110 z-20" : "scale-95 z-10";

          // Small screen: only show the middle card
          const visibilityClass = i === 1 ? "flex" : "hidden lg:flex";

          return (
            <div
              key={i}
              className={`${visibilityClass} relative bg-white rounded-xl ${scale} w-80 md:w-96 lg:w-96 h-96 md:h-96 lg:h-96 pt-16 pb-6 px-6 flex flex-col transition-transform duration-500 shadow-[0_20px_40px_-10px_rgba(251,138,34,0.15)]`}
            >
              {/* Inner Orange Border Box */}
              <div className="flex-1 bg-white rounded-3xl border-2 border-[#FB8A22] px-5 pt-8 pb-4 flex flex-col items-center text-center relative">
                {/* Circular Image */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md z-20">
                  <Image src={t.img} alt={t.name} width={105} height={105} className="object-cover" />
                </div>

                {/* Name & Role */}
                <div className="mt-8 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">{t.name}</h3>
                  <p className="text-xs text-[#0D0D0D] font-medium mb-3">{t.role}</p>
                </div>

                {/* Testimonial Text */}
                <p className="text-black text-[13px] leading-normal text-center">{t.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
