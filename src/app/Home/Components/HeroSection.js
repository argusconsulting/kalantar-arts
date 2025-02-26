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

  return (
    <section className="relative  md:pt-32 pt-36 flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-r from-[#E8DFF7] to-[#B292D9] px-4 md:px-10">
      <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-7xl relative">
        {slides.length > 0 && (
          <div className="flex flex-col md:flex-row w-full relative">
            <div className="w-full md:w-1/2 flex justify-center p-4 relative">
              <Image 
                className="absolute  z-[50]  top[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24"
                src='/Other-Icons/paper-clip 1.svg' 
                width={1000} 
                height={1000} 
                alt='image'
              />
              <div className="border-x-[1rem] mt-4 border-t-[1rem] border-b-[2rem] border-white w-[30rem] h-96 overflow-hidden relative">
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
            <div className="w-full md:w-1/2 flex flex-col justify-between p-4 text-center md:text-left">
              <div className="w-full">
                <Image
                  src="/Other-Icons/“.svg"
                  className="object-contain w-10 mb-4 mx-auto md:mx-0 max-md:w-6"
                  alt=""
                  width={1000}
                  height={1000}
                />
                <p className="text-sm sm:text-lg md:text-3xl font-bold tracking-tighter p-2    text-[#ffd500] leading-relaxed opacity-90">
                  {slides[currentIndex].quote}
                </p>
              </div>
              <span className="text-xs sm:text-sm md:text-xl text-white font-bold mt-2">
                {slides[currentIndex].author}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
