import Navbar from "../../components/guestComponents/Navbar";
import Footer from "../../components/guestComponents/Footer";
import Image from "@/components/ui/image";
import FAQSection from "../../components/guestComponents/FAQSection";
import { InterFont, PoppinsFont } from "@/lib/font";

export default function AboutPage() {
  return (
    <div className={`min-h-screen flex flex-col ${PoppinsFont.className}`}>
      <Navbar />

      {/* Orange Image at top-left */}
      <div className="absolute top-[64px] left-0 z-0">
        <Image
          src="/final_cropped_orange.svg"
          alt="Orange Decoration"
          width={200}
          height={270}
          className="object-contain"
        />
      </div>

      <main className="flex-1 flex flex-col px-8 py-16 max-w-full mx-auto w-full relative">
        <div className="flex flex-col items-center text-center">
          <h1 className={`text-4xl font-bold mb-4 ${InterFont.className}`}>
            About{" "}
            <span
              className={`text-4xl text-[#FB8A22] font-bold mb-4 ${InterFont.className}`}
            >
              Us
            </span>
          </h1>
          <p
            className={`sm:text-lg text-md text-[#22262AE5] font-medium mb-8 ${InterFont.className}`}
          >
            &quot;Empowering restaurants to run smarter, serve better, and grow
            faster.&quot;
          </p>

          <div className="flex justify-center items-center w-full gap-x-8 lg:gap-x-18 mx-auto">
            <div className="flex justify-start">
              <Image
                src="/about1.svg"
                alt="Left Image"
                width={500}
                height={500}
                className="w-[25rem] h-auto object-contain"
              />
            </div>
            <div className="flex justify-end">
              <Image
                src="/about3.svg"
                alt="present goal and vision"
                width={500}
                height={500}
                className="w-[42rem] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Our Values */}
      <div className="relative flex justify-center items-center text-center my-12">
        <h1
          className={`text-4xl font-bold mb-4 relative z-10 ${InterFont.className}`}
        >
          Our Values
        </h1>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <Image
            src="/leaf-right.svg"
            alt="leaf decoration"
            width={90}
            height={90}
            className="object-contain opacity-90"
          />
        </div>
      </div>

      <div className="mt-6 w-[95%] lg:w-[80%] bg-white rounded-3xl shadow-[0_20px_50px_-10px_#00000022,0_10px_25px_-8px_#0000001a] p-6 sm:p-10 mx-auto mb-20 flex justify-between gap-x-4 sm:gap-x-6 text-center">
        {/* Section 1 */}
        <div className="flex-1 flex flex-col items-center px-2 sm:px-6">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center mb-3">
            <Image
              src="/value1.svg"
              alt="Innovation"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold mb-2">
            Seamless Operations
          </h3>
          <p className="text-[#606060] text-[10px] sm:text-sm leading-relaxed max-w-xs">
            Simplify restaurant workflows so you can focus on delivering great
            dining experiences.
          </p>
        </div>

        <div className="hidden sm:block w-px bg-gray-300 self-stretch"></div>

        {/* Section 2 */}
        <div className="flex-1 flex flex-col items-center px-2 sm:px-6">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center mb-3">
            <Image
              src="/value2.svg"
              alt="Integrity"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold mb-2">
            Smart Efficiency
          </h3>
          <p className="text-[#606060] text-[10px] sm:text-sm leading-relaxed max-w-xs">
            Automate routine tasks to save time, cut costs, and boost overall
            performance.
          </p>
        </div>

        <div className="hidden sm:block w-px bg-gray-300 self-stretch"></div>

        {/* Section 3 */}
        <div className="flex-1 flex flex-col items-center px-2 sm:px-6">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center mb-3">
            <Image
              src="/value3.svg"
              alt="Service"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold mb-2">
            Reliable Support
          </h3>
          <p className="text-[#606060] text-[10px] sm:text-sm leading-relaxed max-w-xs">
            Get continuous guidance, timely updates, and dedicated assistance
            whenever you need.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="relative flex justify-center items-center text-center my-12">
        <h1
          className={`text-4xl font-bold mb-4 relative z-10 ${InterFont.className}`}
        >
          Frequently Ask Questions
        </h1>
      </div>
      <FAQSection />

      <Footer />
    </div>
  );
}
