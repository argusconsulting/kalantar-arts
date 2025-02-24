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
    <section className="relative flex justify-center items-center h-screen overflow-hidden bg-gradient-to-r from-[#E8DFF7] to-[#B292D9]">
      
      <div  className="flex  justify-center items-center h-screen overflow-hidden">
        {slides.length > 0 && (
          <div className="flex flex-col md:flex-row w-full md:px-20">
            <div className="  h-[20rem]  w-[25] md:w-1/2 p-5 flex justify-center">
            {/* <Image className="  hidden md:block absolute top-32 w-32 left-72  md:left-80 z-5" src="/Other-Icons/paper-clip 1.svg" alt="" width={1000} height={1000} /> */}
              <div className="border-x-[1rem] border-t-[1rem] border-b-[2rem] border-white w-full max-w-md md:max-w-full md:h-[25rem] max-h-96 overflow-hidden">
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
            <div className="md:w-1/2 flex flex-col justify-between p-5">
              <div className="w-full">
                <Image
                  src="/Other-Icons/“.svg"
                  className="object-contain w-10 mb-4 max-md:w-6"
                  alt=""
                  width={1000}
                  height={1000}
                />
                <p className="text-base md:text-3xl transition-transform duration-1000 ease-in-out font-bold tracking-tighter p-2 text-[#FFDD00] leading-relaxed opacity-90">
                  {slides[currentIndex].quote}
                </p>
              </div>
              <span className="text-sm md:text-xl transition-transform duration-1000 ease-in-out text-white font-bold">
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