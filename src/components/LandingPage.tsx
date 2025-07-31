"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import {
  faBookOpen,
  faFilm,
  faPaintBrush,
  faHeart,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Hero from "./landing/Hero";
import FeaturedFeatures from "./landing/FeaturedFeatures";
import WhyLiniAksara from "./landing/WhyLiniAksara";
import ContentShowcase from "./landing/ContentShowcase";

export const Features = [
  {
    icon: faBookOpen,
    title: "Read Comics and Light Novels",
    description:
      "Access original works from creators across the globe and enjoy exciting stories every day."
  },
  {
    icon: faFilm,
    title: "Watch Animation & Drama",
    description:
      "Stream your favorite anime and dramas legally in the highest quality."
  },
  {
    icon: faPaintBrush,
    title: "Fanart & Artwork Upload",
    description:
      "Share your visual works such as illustrations, zines, and comics to the community."
  },
  {
    icon: faHeart,
    title: "Donate to Creator",
    description:
      "Support your favorite creators and translators through the donation & premium system."
  },
  {
    icon: faTrophy,
    title: "Event & Premium",
    description:
      "Join community competitions and events, and get exclusive premium access."
  },
  {
    icon: faUsers,
    title: "Active Community",
    description:
      "Have fun discussions, create a group, or chat with other creators & fans!"
  },
];

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("theme") === "dark";
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onOpen = (type: "login" | "signup") => {
    console.log(`Opening ${type} modal`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        onOpen={onOpen} 
      />

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-[#8A84E2] to-[#84E2DC] text-white shadow-lg hover:scale-110 transition-all duration-300"
        aria-label="Scroll to Top"
      >
        <FaArrowUp />
      </button>

      <Hero onOpen={onOpen} />
      
      <FeaturedFeatures features={Features} />
      
      <WhyLiniAksara />
      
      <ContentShowcase />
      
      <Footer />
    </div>
  );
}
