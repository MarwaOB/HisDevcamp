import React from "react";

// import des images locales
import predictionImg from "../assets/AI.jpg";
import reportingImg from "../assets/Results.jpg";
import statisticsImg from "../assets/Sales.png";

const features = [
  {
    icon: predictionImg,
    title: "Prediction",
    description: "We deliver the final work with great professional way.",
  },
  {
    icon: reportingImg,
    title: "Reporting",
    description: "We deliver the final work with great professional way.",
    active: true,
  },
  {
    icon: statisticsImg,
    title: "Statistics",
    description: "We deliver the final work with great professional way.",
  },
];

export default function WhyChoosingUs() {
  return (
    <div className="min-h-screen bg-white mt-[10px] ml-[10px] pt-12">
      <h2 className="text-4xl text-left text-[#1f6d60] font-bold mb-12">
        Why Choosing <br /> Us?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`transition-all duration-300 p-8 text-center border border-gray-200 rounded-xl bg-white shadow-[6px_6px_20px_rgba(0,0,0,0.1)] ${
              feature.active ? "scale-105 shadow-[6px_6px_20px_#28887A]" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-[70px] h-[70px] mb-4"
              />
              <h3 className="text-lg text-black font-semibold mt-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {feature.description}
              </p>
              {feature.active && (
                <div className="mt-4 w-full flex justify-end">
                  {/* Extra content for active card if needed */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
