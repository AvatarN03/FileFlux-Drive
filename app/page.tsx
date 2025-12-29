"use client";

import { useEffect, useState } from "react";

import Footer from "./_uiParts/Footer";
import Features from "./_uiParts/Features";
import Pricing from "./_uiParts/Pricing";
import Hero from "./_uiParts/Hero";
import Navbar from "./_uiParts/Navbar";

const LandingPage = () => {
  const [navColor, setNavColor] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY >= vh && scrollY < vh * 2) {
        setNavColor(true);
      } else {
        setNavColor(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="relative bg-gradient-62">
      <Navbar navColor={navColor} />

      <Hero />

      <Features />

      <Pricing />

      <Footer />
    </main>
  );
};

export default LandingPage;
