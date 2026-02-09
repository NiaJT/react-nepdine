import Navbar from "../../../components/guestComponents/Navbar";
import { Poppins, Inter } from "next/font/google";
import Footer from "../../../components/guestComponents/Footer";
import Image from "next/image";

// Load fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  const features = [
    {
      title: "  Reports and Insights ",
      frontdesc:
        " It turns data into actionable insights, helping improve efficiency, profitability, and customer satisfaction.",
      backdesc:
        " The Reports & Insights feature gives you a clear view of sales performance, top-selling menu items, and peak dining hours. With detailed analytics at your fingertips, you can optimize operations, improve efficiency, and boost profitability.",
      icon: "/feature1.svg",
    },
    {
      title: "Waiter Management",
      frontdesc:
        "It tracks waiter performance, and table service efficiency. It ensures smooth operations by monitoring orders, attendance.",
      backdesc:
        "  It focuses on ensuring dining experience. It tracks feedback,  and service quality to enhance loyalty and overall satisfaction. ",
      icon: "/feature2.svg",
    },
    {
      title: "Table Management",
      frontdesc:
        " It organizes table reservations, availability, and seating arrangements . It helps optimize dining space, and improve customer service.",
      backdesc:
        "  Easily keep track of your restaurant’s seating with the Table Management feature. Get a clear view of which tables are free, occupied, or reserved in real time. This helps your staff allocate guests efficiently, reduce waiting times, and improve the overall dining experience for customers. ",
      icon: "/feature3.svg",
    },
    {
      title: " Billing & Invoicing",
      frontdesc:
        " It generates digital or printed bills instantly with accuracy. It supports split payments and ensures full tax compliance with ease.",
      backdesc:
        " The Billing & Invoicing feature lets you generate bills instantly, apply discounts or offers, and support multiple payment methods. With clear, error-free invoices, both staff and customers enjoy a smooth and hassle-free checkout experience. ",
      icon: "/feature4.svg",
    },
    {
      title: " Digital Menu",
      frontdesc:
        " It displays all dishes with descriptions, prices, and images on tablets or mobile devices. ",
      backdesc:
        " Waiters can browse the menu on their device, take customer orders quickly, and send them directly to the kitchen without delays. This reduces errors, speeds up service, and keeps the dining experience smooth.  ",
      icon: "/feature5.svg",
    },
    {
      title: " Customer Experience",
      frontdesc:
        "  It focuses on ensuring dining experience. It tracks feedback,  and service quality to enhance loyalty and overall satisfaction.",
      backdesc:
        " Deliver better service and keep your guests happy with tools designed around their needs. From faster order processing and accurate billing to attentive staff guided by real-time insights, your customers enjoy a seamless dining experience every time they visit. ",
      icon: "/feature6.svg",
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <Navbar />

      {/* Orange Image at top-left */}
      <div className="absolute top-[64px] left-0 z-0 ">
        <Image
          src="/final_cropped_orange.svg"
          alt="Orange Decoration"
          width={200}
          height={270}
          className="object-contain"
        />
      </div>

      <main className="flex-1 flex flex-col px-8 py-16 max-w-6xl mx-auto w-full relative">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${inter.className}`}>
            Features
          </h1>
          <p
            className={`sm:text-lg text-md text-[#22262AE5] font-medium mb-8 ${inter.className}`}
          >
            From order management to analytics, everything you need in one
            system.
          </p>
        </div>

    {/* Flip Cards Grid */}
<div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
  {features.map((feature, index) => (
    <div
      key={index}
      className="group [perspective:1000px] w-full h-48 sm:h-80 lg:h-80"
    >
      <div className="relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front Side */}
        <div className="absolute inset-0 bg-white rounded-2xl flex flex-col items-center justify-center p-3 sm:p-6 [backface-visibility:hidden] shadow-[0_10px_25px_-2px_rgba(251,138,34,0.25),0_4px_10px_-2px_rgba(251,138,34,0.15)]">
          <Image
            src={feature.icon}
            alt={feature.title}
            width={150}
            height={150}
            className="mb-2 sm:mb-4 w-14 sm:w-36 h-auto object-contain"
          />
          <h3 className="text-[10px] sm:text-lg text-[#4A4A4A] font-semibold mb-1 sm:mb-2">
            {feature.title}
          </h3>
          <p className="text-[9px] sm:text-sm text-[#575757] px-1 sm:px-2 leading-relaxed break-words">
            {feature.frontdesc}
          </p>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 bg-[#DEE8FE] rounded-xl flex items-center justify-center p-3 sm:p-6 text-[9px] sm:text-sm font-normal leading-relaxed text-black [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {feature.backdesc}
        </div>
      </div>
    </div>
  ))}
</div>



        
      </main>

      {/* Leaf Decoration below flipcards, right-aligned */}
      <div className="flex justify-end mt-10 right-0 mb-32">
        <Image
          src="/leaf-right.svg"
          alt="leaf decoration"
          width={90}
          height={90}
          className="object-contain opacity-90"
        />
      </div>

      <Footer />
    </div>
  );
}
