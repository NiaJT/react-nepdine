import Navbar from "../../components/guestComponents/Navbar";
import Footer from "../../components/guestComponents/Footer";
import Image from "@/components/ui/image";

import PlanToggle from "../../components/guestComponents/PillToggle";
import { InterFont } from "@/lib/font";

export default function Page() {
  const plans = [
    {
      title: "Basic",
      price: "$4.50",
      features: [
        "50 Image generations",
        "500 Credits",
        "Monthly 100 Credits Free",
        "Customer Support",
        "Dedicated Server",
        "Priority Generations",
        "50GB Cloud Storage",
      ],
    },
    {
      title: "Premium",
      price: "$9.50",
      features: [
        "Advanced Analytics",
        "Digital Payments",
        "Inventory Tracking",
        "Customer Support",
        "Marketing Tools",
        "Reservations Management",
        "Priority Support",
      ],
    },
    {
      title: "Business",
      price: "$14.50",
      features: [
        "Full Accounting",
        "500 Credits",
        "Custom Branding",
        "API Access",
        "Dedicated Server",
        "Dedicated Account Manager",
        "24/7 Premium Support",
      ],
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${InterFont.className}`}>
      <Navbar />

      {/* Orange Image at top-left */}
      <div className="absolute top-[64px] right-0 z-0 ">
        <Image
          src="/orange-right.svg"
          alt="Orange Decoration"
          width={200}
          height={270}
          className="object-contain"
        />
      </div>

      <main className="flex-1 flex flex-col px-4 py-16 w-full relative max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-xl sm:text-4xl font-semibold mb-2 sm:mb-4">
            Choose your right plan!
          </h1>
          <p className="text-xs lg:text-lg text-[#22262AE5] font-medium mb-4 lg:mb-8">
            Sign up in less than 30 seconds. Try out 7 days free trial <br />
            Upgrade at anytime, no question, no hassle.
          </p>

          <PlanToggle />
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 flex flex-wrap justify-center gap-10">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="flex flex-col items-center p-6 rounded-4xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out min-h-[480px] w-[250px] bg-white group hover:bg-[#FB8A22]"
            >
              <h3 className="text-xl font-medium mb-4 text-[#1F1F1F] group-hover:text-white transition-colors duration-500 ease-in-out">
                {plan.title}
              </h3>
              <div className="text-3xl font-bold mb-6 text-[#1F1F1F] group-hover:text-white transition-colors duration-500 ease-in-out">
                {plan.price}
              </div>
              <ul className="flex-1 mb-12 space-y-2 text-[#1F1F1F] text-sm leading-loose group-hover:text-white transition-colors duration-500 ease-in-out">
                {plan.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="relative pl-6 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:border-2 before:border-white before:rounded-sm before:opacity-0 group-hover:before:opacity-100 before:bg-white before:flex before:items-center before:justify-center before:text-[#FB8A22] before:content-['✔'] transition-all duration-500 ease-in-out"
                  >
                    {feat}
                  </li>
                ))}
              </ul>
              {/* Updated button with your desired hover effect */}
              <button
                className="mt-auto bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white py-2 px-6 rounded-lg font-semibold 
                group-hover:bg-white group-hover:text-[#FB8A22] group-hover:bg-none transition-colors duration-800 ease-in-out shadow-md hover:shadow-xl transform hover:scale-105 hover:transition-all hover:duration-300 "
              >
                <a href="/login">Get Started</a>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Free Trial Section with Leaf as background */}
      <div className="relative w-full flex items-center mt-6 mb-20">
        {/* Leaf as background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[100px] h-[230px] -z-10 mt-10">
          <Image
            src="/leaf1.svg"
            alt="leaf decoration"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center text-center ml-6">
          {/* Divider with text */}
          <div className="flex items-center w-full max-w-full mb-4 px-20">
            <div className="flex-1 h-px bg-[#22262A80]"></div>
            <span className="px-4 text-[#22262A80] text-lg">or</span>
            <div className="flex-1 h-px bg-[#22262A80]"></div>
          </div>

          {/* Topic */}
          <h2 className="text-3xl font-semibold mb-6">Start your free trial</h2>

          {/* Button */}
          <button className="px-12 py-3 w-auto max-w-xs bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white font-semibold rounded-full shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <a href="/login">Start Free Trial</a>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
