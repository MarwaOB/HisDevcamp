// src/components/Testimonials.jsx
import React from "react";
import aiImage from "../assets/profil.jpg";

// Duplicate testimonials
const testimonials = Array(4).fill({
  name: "Ben",
  title: "Software engineer",
  message:
    "external links included in WhatFont are being provided as a convenience",
  image: aiImage,
});

const Testimonials = () => {
  return (
    <section className="pb-16 bg-white">
      {/* Title */}
      <h2 className="text-4xl font-bold mr-[30px] text-black text-right leading-snug mb-12">
        What Our Clients <br />
        <span className="text-black">Say?</span>
      </h2>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[20px] gap-y-10 max-w-6xl ml-[30px]">

        {testimonials.map((testimonial, index) => (
          <div key={index} className="relative flex items-start">
            {/* Image overlapping the card */}
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-20 h-20 rounded-full object-cover absolute -top-6 left-0 border-4 border-white shadow-md"
            />

            {/* Card */}
            <div className="bg-teal-700 text-white pt-12 pb-6 pl-6 pr-6 rounded-br-[120px] rounded-tl-lg shadow-lg text-left w-full max-w-sm ml-[2.5rem]">
              <h3 className="text-xl font-bold">{testimonial.name}</h3>
              <p className="text-md font-semibold text-yellow-400">
                {testimonial.title}
              </p>
              <p className="mt-2 text-base leading-relaxed">
                {testimonial.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
