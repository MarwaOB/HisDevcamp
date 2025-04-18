import React, { useState } from "react";
import logo from "../assets/Group.png";

const Navbar = () => {
  const [clicked, setClicked] = useState(null); // null par défaut pour éviter l'état de base

  const handleClick = (button) => {
    setClicked(button);
  };

  return (
    <nav className="w-full flex flex-wrap justify-between items-center py-4 px-8 pt-[0px] bg-white">
      {/* Logo */}
      <img src={logo} alt="StockFlow Logo" className="h-[50px] ml-[-50px]" />

      {/* Menu */}
      <ul className="flex flex-wrap gap-6 text-gray-700 text-base">
  <li>
    <a href="#" className="hover:text-[#FFD476] active:underline active:decoration-[#28887A]">
      About
    </a>
  </li>
  <li>
    <a href="#" className="hover:text-[#FFD476] active:underline active:decoration-[#28887A]">
      Services
    </a>
  </li>
  <li>
    <a href="#" className="hover:text-[#FFD476] active:underline active:decoration-[#28887A]">
      Testimonials
    </a>
  </li>
  <li>
    <a href="#" className="hover:text-[#FFD476] active:underline active:decoration-[#28887A]">
      Get Started
    </a>
  </li>
  <li>
    <a href="#" className="hover:text-[#FFD476] active:underline active:decoration-[#28887A]">
      Jobs
    </a>
  </li>
</ul>


      {/* Buttons */}
      <div className="flex gap-4 mt-4 md:mt-0">
        {/* Sign In Button */}
        <button
          className={`px-4 font-medium rounded transform transition-all duration-200 hover:scale-105 text-[#28887A] border-1 border-[#28887A] ${clicked === 'signIn' ? 'text-[#28887A] border-[#28887A] hover:text-[#28887A]' : 'hover:text-[#28887A]'}`}
          onClick={() => handleClick('signIn')}
        >
          Sign In
        </button>

        {/* Sign Up Button */}
        <button
          className={`text-white px-4 py-2 rounded transform transition-all duration-200 hover:scale-105 bg-[#28887A] ${clicked === 'signUp' ? 'text-white' : 'hover:text-[#ffffff] hover:bg-[#28887A]'}`}
          onClick={() => handleClick('signUp')}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
