import React, { useState } from "react";
import image from "../assets/LP.jpg";
import Navbar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import WhyChoosingUs from "../components/Services";
import Testimonials from "../components/Testimoniols";
import CallToAction from "../components/CallAction";
import Footer from "../components/Footer";

const LandingPage = () => {
  const [clicked, setClicked] = useState(null);

  const handleClick = (buttonType) => {
    setClicked(buttonType);
  };

  return (
    <>
    <div
    className=" ml-[200px] p-6  p-[10px] pt-[0px]"
    >
      <Navbar />
      <HeroSection></HeroSection>
      <WhyChoosingUs></WhyChoosingUs>
      <Testimonials></Testimonials>
      <CallToAction></CallToAction>
      <Footer></Footer>
      </div>
    </>
  );
};

export default LandingPage;
