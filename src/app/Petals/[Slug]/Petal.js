"use client";
import DOMPurify from "dompurify";
import Image from "next/image";
import dynamic from "next/dynamic";
import { MdArrowForwardIos } from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styles
// ✅ Dynamically Import react-slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const Petal = ({ data }) => {
  // ✅ Parse Images Safely
  let Images = [];
  try {
    Images = JSON.parse(data.images || "[]");
  } catch (error) {
    console.error("Error parsing images data:", error);
  }

  // ✅ Slider Arrow Button
  const ArrowButton = ({ onClick, isNext }) => (
    <div
      className={`absolute ${isNext ? "right-3" : "left-3 rotate-180"} top-1/2 transform -translate-y-1/2 border-2 opacity-70 hover:opacity-100 border-white flex items-center justify-center p-2 rounded-full cursor-pointer z-50`}
      onClick={onClick}
    >
      <MdArrowForwardIos color="white" size={30} />
    </div>
  );

  // ✅ Slick Slider Settings
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
    <section className="mt-[5rem] bg-gradient-to-r from-[#faddeb] to-[#f195be] px-4 lg:px-20">
      {/* ✅ Main Content */}
      <section className="pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-6  justify-around">
          <div className="relative ">
            <div className="absolute inset-0 transform scale-105 clip-diamond bg-yellow-400"></div>
            <div className="clip-diamond bg-white w-[21rem] lg:w-[31.75rem] h-[13rem] lg:h-[19.75rem] flex items-center justify-center">
              <Image src={`${process.env.NEXT_PUBLIC_Files_URL}/${data.hero_img}`} width={1000} height={1000} alt={data.title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-4 lg:gap-6  ">
            <h2 className="text-2xl lg:text-4xl font-bold">{data.title}</h2>
            <Image src="/Uploads/Vector 35.svg" alt="Decoration" width={1000} height={1000} className="w-[40%] lg:w-[60%]" />
            <h3 className="text-xl lg:text-3xl font-medium">{data.subtitle}</h3>
          </div>
        </div>

        {/* ✅ Dangerous HTML Rendering */}
        <div className="my-8 lg:my-14">
          <ReactQuill
            value={data?.description || ""}
            readOnly={true}
            theme="bubble" // Use "bubble" or "snow" for styling
          />
        </div>
      </section>

      {/* ✅ Image Slider */}
      <section className="relative my-10">
        <div className="Linebg absolute inset-0 z-10 my-5 w-full"></div>

        <div className="absolute inset-0 z-20">
          {["top-5 left-5", "bottom-5 left-[25%]", "top-44 right-[25%]", "top-5 right-5"].map((position, idx) => (
            <div key={idx} className={`absolute ${position} max-md:h-16 max-md:w-16 h-[8.688rem] w-[8.688rem] rounded-full circularbox`}></div>
          ))}
        </div>

        <div className="relative z-40">
          <Slider {...sliderSettings}>
            {Images?.map((src, index) => (
              <div key={index}>
                <h3 className="text-center py-10 px-2 rounded-lg shadow-lg min-h-54 min-w-96">
                  <Image className="rounded-lg shadow-lg object-fill" src={`${process.env.NEXT_PUBLIC_Files_URL}/${src}`} width={500} height={500} alt={`Image ${index + 1}`} />
                </h3>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </section>
  );
};

export default Petal;
