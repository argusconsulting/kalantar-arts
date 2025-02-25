"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoIosArrowRoundForward, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full"
      onClick={onClick}
    >
      <IoIosArrowBack size={30} />
    </button>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full"
      onClick={onClick}
    >
      <IoIosArrowForward size={30} />
    </button>
  );
};

const CustomSlider = ({ Slider1 }) => {
  const [data, setData] = useState(Slider1);

  if (!data) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Set autoplay speed to 5 seconds
    arrows: true,
    prevArrow: <CustomPrevArrow />, // Custom left arrow
    nextArrow: <CustomNextArrow />, // Custom right arrow
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="relative w-full px-5">
      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index} className="p-3">
            <div
              className={`flex justify-between px-2 items-center h-16 w-full rounded-lg ${
                item.type === "X"
                  ? "bg-black"
                  : item.type === "Instagram"
                  ? "bg-[#C938A8]"
                  : item.type === "LinkedIn"
                  ? "bg-[#007EBB]"
                  : ""
              }`}
            >
              <span className="h-10 w-10 z-20 bg-white rounded-xl">
                <Image src={`/Social-Icos/${item.icon}`} alt={item.icon} width={1000} height={1000} />
              </span>
              <Link href={item.href}>
                <IoIosArrowRoundForward className="-rotate-45" size={50} color="#FFFFFF" />
              </Link>
            </div>
            <Image src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.Image}`} alt="slider" width={1080} height={450} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CustomSlider;
