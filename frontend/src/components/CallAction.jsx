// src/components/CallToAction.jsx
import React from "react";

const CallToAction = () => {
  return (
    <section className="text-center py-16 px-4 my-[50px] bg-white">
      {/* Titre principal */}
      <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
        Take The Next Step To Raise More <br />
        Money And Make a Bigger Impact
      </h2>

      {/* Sous-titre / description */}
      <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
        Discover how our powerful tool can predict your sales<br />
        Process and drive your business growth
      </p>

      {/* Bouton */}
      <button className="bg-[#28887A] hover:bg-teal-800 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
        Get started
      </button>
    </section>
  );
};

export default CallToAction;
