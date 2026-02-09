import Image from "@/components/ui/image";

import Navbar from "../../components/guestComponents/Navbar";
import { Poppins, Roboto } from "next/font/google";
import TestimonialsSlider from "../../components/guestComponents/TestimonialsSlider";
import Footer from "../../components/guestComponents/Footer";

// Load Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function HomePage() {
  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <Navbar />

      <main className="flex-1 flex items-start px-8 py-16 max-w-full mx-auto w-full relative">
        {/* Left side */}
        <div className=" flex flex-col relative">
          {/* Text + Button */}
          <div className="origin-top-left scale-[0.6] sm:scale-100 w-[133%] sm:w-auto">
            <div className="pr-8 mt-8 lg:ml-20">
              <h1 className="font-semibold text-md mb-4">
                WELCOME TO OUR RESTAURANT MANAGEMENT SYSTEM
              </h1>

              <div className="text-2xl md:text-3xl lg:text-5xl font-semibold mb-6 leading-snug">
                Your <span className="text-[#FB8A22]">Go-To</span> Spot <br />
                For Smart <span className="text-[#FB8A22]">Tools</span> And{" "}
                <br />
                Seamless <span className="text-[#FB8A22]">Services</span>
              </div>

              <p className="text-sm text-gray-700 mb-6">
                Manage Your Restaurant Smarter, Faster & Easier
              </p>

              <button
                className="
  px-8 py-2          /* smaller padding on mobile */
  sm:px-12 sm:py-3   /* default padding on sm+ */
  w-auto
  max-w-[180px]       /* smaller max width on mobile */
  sm:max-w-xs         /* default max width on sm+ */
  text-sm             /* smaller font on mobile */
  sm:text-base        /* default font size on sm+ */
  bg-gradient-to-r from-[#FB8A22] to-[#EA454C] 
  text-white font-semibold rounded-full shadow-md 
  hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer
"
              >
                <a href="/login">Start Free Trial</a>
              </button>
            </div>
          </div>

          {/* Orange image full-left */}
          <div className="relative w-[200px] h-[270px] -mb-10 -ml-8 -mt-45 sm:mt-0">
            <Image
              src="/orange1.svg"
              alt="first orange image"
              fill
              style={{ objectFit: "cover" }}
              className=""
            />
          </div>
        </div>

        {/* Right side images */}
        <div className="flex flex-col items-end ml-auto lg:mr-35 space-y-4 -mt-14">
          <div
            className="
    max-sm:origin-top-right
    max-sm:scale-[0.6]
    max-sm:w-[166%]
    max-sm:-translate-x-5 max-sm:mt-15
  "
          >
            {/* Big top image */}
            <div className="relative w-[30vw] min-w-[300px] h-[22vw] min-h-[220px]">
              <Image
                src="/home1.svg"
                alt="Big Image"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>

            {/* Bottom row with 2 images */}
            <div className="flex space-x-4">
              <div className="relative w-[14vw] min-w-[140px] h-[14vw] min-h-[140px] ">
                <Image
                  src="/homee2.svg"
                  alt="Smart Management image"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
              <div className="relative w-[14vw] min-w-[140px] h-[14vw] min-h-[140px] mt-10">
                <Image
                  src="/homee3.svg"
                  alt="Quality Service image"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- DIVIDER WITH TEXT --- */}
      <>
        <style>
          {`
      @import url('https://fonts.googleapis.com/css2?family=Italiana&display=swap');

      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }

      .marquee {
        display: flex;
        width: 200%;
        animation: marquee 20s linear infinite;
      }
    `}
        </style>

        <div className="w-full mx-auto flex flex-col items-center overflow-hidden">
          {/* --- DIVIDER WITH TEXT --- */}
          <div className="flex items-center justify-center w-full mb-2">
            <div className="flex-1 border-t border-black"></div>
            <span
              className="
    bg-white 
    px-4 py-2        /* smaller padding on mobile */
    sm:px-8 sm:py-3   /* default padding on sm+ */
    text-2xl          /* smaller font on mobile */
    sm:text-4xl       /* default font on sm+ */
    rounded-md shadow-sm border border-black
  "
              style={{ fontFamily: "'Italiana', sans-serif" }}
            >
              Our Partner Restaurants
            </span>

            <div className="flex-1 border-t border-black"></div>
          </div>

          {/* --- MARQUEE SECTION --- */}
          <div className="relative w-full overflow-hidden py-4">
            <div className="marquee">
              {/* First set of logos */}
              <div className="flex justify-around items-center w-1/2">
                <Image
                  src="/partner1.svg"
                  alt="Partner 1"
                  width={90}
                  height={90}
                />
                <Image
                  src="/partner2.svg"
                  alt="Partner 2"
                  width={90}
                  height={90}
                />
                <Image
                  src="/partner3.svg"
                  alt="Partner 3"
                  width={90}
                  height={90}
                />
                <Image
                  src="/partner4.svg"
                  alt="Partner 4"
                  width={90}
                  height={90}
                />
                <Image
                  src="/partner5.svg"
                  alt="Partner 5"
                  width={90}
                  height={90}
                />
              </div>

              {/* Duplicate set for smooth loop */}
              <div className="flex justify-around items-center w-1/2">
                <Image
                  src="/partner1.svg"
                  alt="Partner 1"
                  width={90}
                  height={90}
                />
                <Image
                  src="/partner2.svg"
                  alt="Partner 2"
                  width={90}
                  height={90}
                />
                <Image
                  src="/partner3.svg"
                  alt="Partner 3"
                  width={90}
                  height={90}
                />
                <Image
                  src="/partner4.svg"
                  alt="Partner 4"
                  width={90}
                  height={90}
                />
                <Image
                  src="/partner5.svg"
                  alt="Partner 5"
                  width={90}
                  height={90}
                />
              </div>
            </div>
          </div>

          {/* --- DIVIDER LINE --- */}
          <hr className="border-t border-black w-full rounded-full mt-1" />
        </div>
      </>

      {/* --- WRAPPER FOR TESTIMONIALS + ORANGE BG --- */}
      <div className="relative w-full">
        {/* Orange image as background (right side) */}
        <div className="absolute right-0 top-0 w-[220px] h-[320px]">
          <Image
            src="/orange2.svg"
            alt="orange background"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-90 "
          />
        </div>

        {/* --- SECOND SECTION (Testimonials) --- */}
        <section className="px-8 py-32  mx-auto relative z-10 ">
          <h2
            className={`text-4xl sm:text-5xl font-semibold mb-4 text-center ${roboto.className}`}
          >
            Testimonials
          </h2>
          <p className="text-[#FB8A22] max-w-2xl mx-auto text-md sm:text-xl mb-12 text-center">
            Here&apos;s what our clients say about us
          </p>

          {/* --- Slider Wrapper --- */}
          <TestimonialsSlider />
        </section>
      </div>

      {/* --- Leaf Image After Testimonials --- */}

      <div className="relative w-[100px] h-[230px] -mt-40 ">
        <Image
          src="/leaf1.svg"
          alt="first leaf image"
          fill
          style={{ objectFit: "cover" }}
          className=""
        />
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  );
}
