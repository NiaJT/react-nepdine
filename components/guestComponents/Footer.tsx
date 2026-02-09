

import Image from "next/image";
import { Icon } from '@iconify/react';
import mapPinOutline from '@iconify-icons/mdi/map-marker-outline';
import phoneOutline from '@iconify-icons/mdi/phone-outline';
import envelopeOutline from '@iconify-icons/mdi/email-open-outline';
import clockOutline from '@iconify-icons/mdi/clock-outline';


export default function Footer() {
  return (

    <div>
    <footer className="bg-gray-100 text-black py-16 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
      
        {/* --- Column 1: Logo & Description --- */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <Image src="/2.png" alt="Logo" width={50} height={50} />
            <span className="font-bold text-xl">Nep
                <span className="text-[#FB8A22]">dine</span></span>
          </div>
          <p className="text-black text-sm font-semibold">
            To know more about us <br/>
            <span className="font-normal text-[#333333]">Follow us on</span>
          </p>
        </div>

      {/* --- Column 2: Contact Info --- */}
<div className="flex flex-col space-y-3">
  <h4 className="font-semibold text-lg mb-2">Contact Us</h4>
  
  <div className="flex items-center space-x-2">
    <Icon icon={mapPinOutline} className=" w-5 h-5 text-[#333333]" />
    <span className="text-[#333333] text-sm">Bhaktapur, Nepal</span>
  </div>
  
  <div className="flex items-center space-x-2">
    <Icon icon={phoneOutline} className=" w-5 h-5 text-[#333333]" />
    <span className="text-[#333333] text-sm">01-54321</span>
  </div>
  
  <div className="flex items-center space-x-2">
    <Icon icon={envelopeOutline} className=" w-5 h-5 text-[#333333]" />
    <span className="text-[#333333] text-sm">M.Alyaqout@4house.Co</span>
  </div>
  
  <div className="flex items-center space-x-2">
    <Icon icon={clockOutline} className=" w-5 h-5 text-[#333333]" />
    <span className="text-[#333333] text-sm">Sun - Sat / 10:00 AM - 8:00 PM</span>
  </div>
</div>

        {/* --- Column 3: Links --- */}
        <div className="flex flex-col space-y-2">
          <h4 className="font-semibold text-lg mb-2">Links</h4>
          <a href="/about" className="text-[#333333] hover:text-[#FB8A22] transition text-sm">About Us</a>
          <a href="/features" className="text-[#333333] hover:text-[#FB8A22] transition text-sm">Features</a>
          <a href="/pricing" className="text-[#333333] hover:text-[#FB8A22] transition text-sm">Pricing</a>
          <a href="/contact" className="text-[#333333] hover:text-[#FB8A22] transition text-sm">Contact Us</a>
        </div>

      {/* --- Column 4: Instagram Gallery --- */}
<div className="flex flex-col space-y-2">
  <h4 className="font-semibold text-lg mb-2">Instagram</h4>
  <div className="grid grid-cols-3 gap-2">
    <Image src="/footer1.svg" alt="footer 1" width={80} height={80} className="" />
    <Image src="/footer2.svg" alt="footer 2" width={80} height={80} className="" />
    <Image src="/footer3.svg" alt="footer 3" width={80} height={80} className="" />
    <Image src="/footer4.svg" alt="footer 4" width={80} height={80} className="" />
    <Image src="/footer5.svg" alt="footer 5" width={80} height={80} className="" />
    <Image src="/footer6.svg" alt="footer 6" width={80} height={80} className="" />
  </div>
  
</div>

      </div>



    </footer>

 {/* --- Bottom Section / Copyright + Links --- */}
<div className="bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white font-normal py-4 mt-5 px-6">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
    {/* Left Text */}
    <span className="text-sm">
      Copyright © {new Date().getFullYear()}. All rights reserved
    </span>

    {/* Right Links */}
    <div className="flex space-x-4 mt-2 md:mt-0 text-sm">
      <a href="/privacy" className="hover:underline">Privacy Policy</a>
      <a href="/terms" className="hover:underline">Terms of Use</a>
      <a href="/partner" className="hover:underline">Partner</a>
    </div>
  </div>
</div>


</div>


  );
}
