import React, { useState } from "react";
import image from "../assets/LP.jpg";
import Navbar from "../components/NavBar";

const HeroSection = () => {
  const [clicked, setClicked] = useState(null);

  const handleClick = (buttonType) => {
    setClicked(buttonType);
  };

  return (
    <>
      
      <header className="relative min-h-screen mt-[50px] bg-white overflow-hidden font-sans">
        {/* Background Shape */}
        <div className="absolute top-0 left-0 w-full md:w-3/5 h-full max-h-[600px] bg-[#FFD476] rounded-tr-[200px] z-0" />


        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between min-h-screen px-6 md:px-16 py-20 gap-10">
          {/* Left Side */}
          <div className="w-full md:w-1/2 flex h-[100px] flex-col justify-center gap-6 text-left">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1f6d60] leading-tight">
              StockFlow
            </h1>
            <h2 className="text-2xl md:text-4xl font-serif font-semibold text-black">
              Smarter Demand Forecasting
            </h2>
            <p className="text-gray-800 max-w-md text-lg leading-relaxed">
              StockFlow is an intelligent platform that helps you forecast demand
              accurately, optimize inventory, and make data-driven decisions with ease.
            </p>

            {/* Updated Buttons with active style */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {/* Get Started */}
              <button
                className={`px-6 py-3 font-medium rounded transform transition-all duration-200 hover:scale-105 text-[#28887A] border border-[#28887A] ${
                  clicked === "getStarted"
                    ? "bg-[#FFD476] text-white border-none"
                    : "hover:text-[#FFD476]"
                }`}
                onClick={() => handleClick("getStarted")}
              >
                Get started
              </button>

              {/* Try Free Trial */}
              <button
                className={`px-6 py-3 rounded text-white transform transition-all duration-200 hover:scale-105 bg-[#28887A] ${
                  clicked === "freeTrial"
                    ? "bg-[#FFD476] text-white"
                    : "hover:text-white hover:bg-[#1f6d60]"
                }`}
                onClick={() => handleClick("freeTrial")}
              >
                Try free trial
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative z-20">
            <img
              src={image}
              alt="Charts and analytics"
              className="rounded-bl-[100px] shadow-xl w-[90%] max-w-[900px] object-cover"
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default HeroSection;
