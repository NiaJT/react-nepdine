"use client";

import { useState } from "react";

export default function FAQAccordion() {
  const faqs = [
    { question: "Can I use Nepdine software for free?", answer: "Yes, Nepdine offers a free trial of software for you to explore the features and functionalities." },
    { question: "What happens if I need more features later?", answer: "You can easily upgrade your plan anytime as your restaurant grows." },
    { question: "How does this help improve my restaurant’s efficiency?", answer: "It automates tasks, reduces errors, saves time, and gives you real-time insights to make smarter decisions." },
    { question: "Can I access the system on mobile or tablet?", answer: "Yes, you can easily access the system on any mobile or tablet through a web browser or app." },
    { question: "Is my data safe in the system?", answer: "Yes, your data is safe —— it's protected with secure encryption and regular backups to ensure privacy and reliability." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex-1 space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-lg p-7 shadow-lg text-medium text-[#1B1139] transition-shadow duration-500"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left font-medium flex justify-between items-center"
          >
            {faq.question}
            <div
              className={`w-5 h-5 bg-[#FB8A22] rounded-full cursor-pointer flex items-center justify-center text-white transition-transform duration-700 ${
                openIndex === index ? "rotate-180" : "rotate-0"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {/* Smooth expanding/collapsing answer */}
          <div
            className={`overflow-hidden transition-all duration-700 ease-in-out ${
              openIndex === index ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-gray-700 text-sm">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
