"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdArrowForwardIos } from "react-icons/md";

const Page = () => {
  const [data, setData] = useState([]);
  const pathname = usePathname();
  const url = useMemo(() => pathname.split("/")[2], [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Petals`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.JWT_SECRET}`,
          },
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [pathname]);

  const filteredData = useMemo(() => data.filter((item) => item.slug === url), [data, url]);
  const imagesData = filteredData[0]?.images || "[]";

  let Images = [];
  try {
    Images = JSON.parse(imagesData);
  } catch (error) {
    console.error("Error parsing images data:", error);
  }

  const ArrowButton = ({ onClick, isNext }) => (
    <div
      className={`absolute ${isNext ? "right-3" : "left-3 rotate-180"} top-1/2 transform -translate-y-1/2 border-2 opacity-70 hover:opacity-100 border-white flex items-center justify-center p-2 rounded-full cursor-pointer z-50`}
      onClick={onClick}
    >
      <MdArrowForwardIos color="white" size={30} />
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <ArrowButton isNext />,
    prevArrow: <ArrowButton />,
    centerMode: true,
    centerPadding: "20px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "10px" } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: "10px" } },
    ],
  };

  return (
    <section className="mt-[14rem] px-4 lg:px-20">
      {filteredData.slice(0, 1).map((item, index) => (
        <section key={index}>
          <div className="flex flex-col lg:flex-row items-center gap-6 w-full justify-between">
            <div className="relative">
              <div className="absolute inset-0 transform scale-105 clip-diamond bg-yellow-400"></div>
              <div className="clip-diamond bg-white w-[20rem] lg:w-[30.75rem] h-[12rem] lg:h-[18.75rem] flex items-center justify-center">
                <Image src={`/Uploads/Petals/${item?.hero_img}`} width={1000} height={1000} alt={item.title} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 lg:gap-6 w-full lg:w-2/4">
              <h2 className="text-2xl lg:text-4xl font-bold">{item.title}</h2>
              <Image src="/Uploads/Vector 35.svg" alt="Decoration" width={1000} height={1000} className="w-[40%] lg:w-[60%]" />
              <h3 className="text-xl lg:text-3xl font-medium">{item.subtitle}</h3>
            </div>
          </div>

          <div className="my-8 lg:my-14 text-lg lg:text-2xl font-normal px-4 lg:px-28">
            <p className="text-left">{item.description}</p>
          </div>
        </section>
      ))}

      <section className="relative my-10">
        <div className="Linebg absolute inset-0 z-10 my-5 w-full"></div>

        <div className="absolute inset-0 z-20">
          {["top-5 left-5", "bottom-5 left-[25%]", "top-44 right-[25%]", "top-5 right-5"].map((position, idx) => (
            <div key={idx} className={`absolute ${position} max-md:h-16 max-md:w-16 h-[8.688rem] w-[8.688rem] rounded-full circularbox`}></div>
          ))}
        </div>

        <div className="relative z-40">
          <Slider {...sliderSettings}>
            {Images.map((src, index) => (
              <div key={index}>
                <h3 className="text-center py-10 px-2 rounded-lg shadow-lg">
                  <Image className="rounded-lg shadow-lg" src={`/Uploads/Petals/${src}`} width={500} height={500} alt={`Image ${index + 1}`} />
                </h3>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </section>
  );
};

export default Page;
