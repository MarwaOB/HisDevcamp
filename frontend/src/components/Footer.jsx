import React from "react";
import { FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import logo from "../assets/Group.png";

const Footer = () => {
  return (
    <footer className="bg-[#FFD476] mt-[50px] rounded-br-[200px] px-6 md:px-20 py-16 text-black">
   <div className="flex flex-col md:flex-row justify-between h-full">
      {/* Left: Title, Logo, Social Icons */}
      <div className="flex flex-col justify-start gap-4">
        <h2 className="text-3xl text-left font-bold">Stay Connected
           <div className="mt-[8px]">StockFlow</div>
        </h2>
  
       <div className="h-[10px]"></div>
        <div className="flex gap-6 text-teal-700 text-2xl">
          <FaLinkedinIn />
          <FaInstagram />
          <FaXTwitter />
        </div>
      </div>
  
      {/* Right: Links pushed to bottom */}
      <div className="flex flex-col justify-end mt-[50px] md:mt-0">
        <div className="h-[120px]"></div>
        <div className="grid grid-cols-3 gap-10 text-sm text-gray-800 text-left">
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-2 text-black">Company</h3>
            <ul className="space-y-1">
              <li>About Us</li>
              <li>Services</li>
              <li>Pricing</li>
              <li>Contact</li>
            </ul>
          </div>
  
          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-2 text-black">Ressources</h3>
            <ul className="space-y-1">
              <li>Help and Support</li>
              <li>Community</li>
            </ul>
          </div>
  
          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-2 text-black">Legal</h3>
            <ul className="space-y-1">
              <li>Terms of service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
  
  );
};

export default Footer;
