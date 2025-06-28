"use client";

import {useState, useEffect} from "react";

export default function ScrollUp() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 1000) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 p-3 z-100 bg-white text-black border border-black hover:bg-accent rounded-full cursor-pointer transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}