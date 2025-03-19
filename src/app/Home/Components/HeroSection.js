"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = ({ data }) => {
  const [slides, setSlides] = useState(data.HeroSlider);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  const formatAuthor = (author) => {
    if (!author) return ""; // Handle cases where author data is missing
    const parts = author.split(","); // Split at comma
    return (
      <>
        {parts[0]},<br /> {parts.slice(1).join(",")}
      </>
    );
  };

  return (
    <section className="relative flex justify-center  md:mt-24 items-center h-screen md:h-[75vh] overflow-hidden bg-gradient-to-r bg-[#f8deeb] px-4 md:px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl relative">
        {slides.length > 0 && (
          <>
            <div className="flex justify-center items-center p-2 relative">
              <div className="border-[0.5rem] border-black w-full h-[20rem] md:h-[32rem] overflow-hidden relative">
                <motion.img
                  key={currentIndex}
                  initial={{ x: "100%" }}
                  animate={{ x: "0%" }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  src={`${process.env.NEXT_PUBLIC_Files_URL}/${slides[currentIndex].image}`}
                  width={1000}
                  height={1000}
                  className="object-cover w-full h-full"
                  alt={`Slide ${currentIndex + 1}`}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center p-4 text-center md:text-left">
              <div className="w-full">
                <p className="text-sm text-justify sm:text-lg md:text-2xl font-bold tracking-tighter p-2 text-[#e51183] leading-relaxed opacity-90">
                  <Image
                    src="/Other-Icons/start.png"
                    className="inline-block w-3 h-3 align-top "
                    alt="Quote Start"
                    width={10}
                    height={10}
                  />
                  {slides[currentIndex].quote}
                  <Image
                    src="/Other-Icons/end.png"
                    className="inline-block w-3 h-3 align-top "
                    alt="Quote End"
                    width={10}
                    height={10}
                  />
                </p>
              </div>
              <span className="text-xs w-full sm:text-sm md:text-xl pl-3 text-black font-bold mt-2">
                {formatAuthor(slides[currentIndex].author)}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;