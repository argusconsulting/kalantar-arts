"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const HeroSection = ({data}) => {
  const [slides, setSlides] = useState(data.HeroSlider);
  const [currentIndex, setCurrentIndex] = useState(0);


  // Update the current slide every 5 seconds
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [slides]); // Run the effect when `slides` changes

  // Ensure the slides array is populated before rendering
  if (!slides.length) {
    return null; // Or show a loading state here
  }

  return (
    <section className="h-screen w-full overflow-hidden relative">
      <div className="md:flex-row  max-md:h-screen max-md:flex-col flex md:px-16 linearGradient bg-gray-100 pt-[10rem] px-1">
        {/* Image Section */}
        <Image className="  hidden md:block absolute w-32 left-72  md:left-80 z-5" src="/Other-Icons/paper-clip 1.svg" alt="" width={1000} height={1000} />
        <div className="relative   md:p-24 w-full md:w-2/4   max-md:justify-center flex items-center">
        
          <div className="border-x-[1rem] border-t-[1rem] border-b-[2rem] border-white  md:w-full  md:h-[25rem] h-72 w-72 overflow-hidden">
            <div
              className="transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                display: "flex",
              }}
            >
              {slides.map((slide, index) => (
                <Image
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_Files_URL}/${slide.image}`}
                  width={1000}
                  height={1000}
                  className="object-fill w-full h-full"
                  alt={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full md:w-2/4 flex flex-col items-start justify-evenly p-5">
          <div className="w-full max-md:mx-10">
            <span className="w-10 h-10">
              <Image
                src="/Other-Icons/“.svg"
                className="object-contain w-10 max-md:w-6"
                alt=""
                width={1000}
                height={1000}
              />
            </span>
            <p className="font-bold max-md:text-base text-left  text-3xl text-white uppercase mt-1 md:mt-3">
              {slides[currentIndex].quote.split(" ").map((word, index) =>
                word.includes("children") || word.includes("art") ? (
                  <span key={index} className="text-[#FFDD00]">
                    {word}{" "}
                  </span>
                ) : (
                  `${word} `
                )
              )}
            </p>
          </div>
          <div className="w-full flex justify-evenly items-center my-1 py-2 text-white">
            <h4 className="text-2xl max-md:text-base font-semibold">
              {slides[currentIndex].author}
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
