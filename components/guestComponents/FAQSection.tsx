"use client";

import { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import FAQAccordion from "./FAQAccordion";
import { Faq, useAddFaq } from "@/hooks/useFaq";
import { Icon } from "@iconify/react";
import sendIcon from "@iconify-icons/mdi/send";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function FAQSection() {
  const [question, setQuestion] = useState(""); // ✅ store user input
  const [loading, setLoading] = useState(false);
  const { mutate: addFaq } = useAddFaq();

  // ✅ On submit handler
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return; // prevent empty submit
    setLoading(true);

    const data: Faq = { question };
    addFaq(data, {
      onSuccess: () => {
        setQuestion(""); // clear input after success
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div
      className={`${inter.className} flex flex-col md:flex-row w-full max-w-6xl gap-10 mx-auto px-4 md:px-0 mb-10`}
    >
      <FAQAccordion />

      <div className="flex-1 flex flex-col items-center p-4 -mt-10">
        <Image
          src="/faq.svg"
          alt="FAQ Illustration"
          width={400}
          height={350}
          className="object-contain mb-6"
        />
 
        <div className="text-center text-[#FB8A22] font-semibold text-xl mb-10">
          Any Questions? <br />
          <span className="text-[#1B1139] text-xs">
            You can ask anything you want to know Feedback!
          </span>
        </div>

       {/* ✅ Form section */}
<form onSubmit={onSubmit} className="w-full max-w-xs mb-4 relative">
  <span className="text-[#1B1139] font-semibold text-xs block mb-1 text-left">
    Let me know
  </span>

  {/* Wrapper div to position icon */}
  <div className="relative">
    <input
      type="text"
      placeholder="Enter Here"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      className="w-full border border-gray-300 px-4 py-2 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-[#FB8A22]"
    />

    {/* ✈️ Airplane icon appears only when text is typed */}
    {question && (
      <Icon
        icon={sendIcon}
        onClick={onSubmit}
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#FB8A22] text-lg cursor-pointer transition-transform duration-300 hover:scale-125 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
    )}
  </div>
</form>
      </div>
    </div>
  );
}
