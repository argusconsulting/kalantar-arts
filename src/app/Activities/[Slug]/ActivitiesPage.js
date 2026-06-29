"use client";
import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MdArrowForwardIos } from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// ✅ Dynamically Import react-slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const ActivitiesPage = ({ data }) => {
  // ✅ Parse Images Safely handling both JSON and comma-separated strings
  let Images = [];
  let heroImage = data?.hero_img || "";
  try {
    // 1. Prefer the new dedicated images JSON array (from Option A upgrade)
    if (data?.images && data.images !== "[]") {
      Images = JSON.parse(data.images);
    } 
    // 2. Fallback to old legacy comma-separated images hack
    else if (data?.image) {
      const allImages = data.image.split(',');
      if (allImages.length > 0) {
        heroImage = heroImage || allImages[0];
        Images = allImages.slice(1);
      }
    }
  } catch (error) {
    console.error("Error parsing images data:", error);
  }

  const title = data?.title || data?.name || "Activity";
  const subtitle = data?.subtitle || "";
  const description = data?.description || data?.Richtext || "";

  let imageNames = [];
  let isLegacyImages = false;
  try {
    if (data?.extra_data) {
      const extraData = JSON.parse(data.extra_data);
      imageNames = extraData?.imageNames || [];
    }
    if (!data?.images || data.images === "[]") {
      isLegacyImages = true;
    }
  } catch (error) {
    console.error("Error parsing extra_data:", error);
  }

  if (!description && !heroImage && Images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200 text-pink-900 px-6">
        <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md w-full mt-20">
          <h1 className="text-6xl font-extrabold text-pink-600 animate-pulse mb-4">Coming Soon</h1>
          <p className="text-lg text-pink-700 mb-6">
            We’re crafting something beautiful just for you. Stay tuned!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 text-white bg-pink-600 rounded-lg shadow hover:bg-pink-700 transition-colors duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
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
              {heroImage && (
                <Image src={`${process.env.NEXT_PUBLIC_Files_URL}/${heroImage}`} width={1000} height={1000} alt={title} className="w-full h-full object-cover" />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-4 lg:gap-6  ">
            <h2 className="text-2xl lg:text-4xl font-bold">{title}</h2>
            <Image src="/Uploads/Vector 35.svg" alt="Decoration" width={1000} height={1000} className="w-[40%] lg:w-[60%]" />
            {subtitle && (
              <h3 className="text-xl lg:text-3xl font-medium">{subtitle}</h3>
            )}
          </div>
        </div>

        {/* ✅ HTML Rendering */}
        <div className="my-8 lg:my-14 prose max-w-none tiptap-content" dangerouslySetInnerHTML={{ __html: description }} />
      </section>

      {/* ✅ Image Slider */}
      {Images?.length > 0 && (
        <section className="relative my-10">
          <div className="Linebg absolute inset-0 z-10 my-5 w-full"></div>

          <div className="absolute inset-0 z-20">
            {["top-5 left-5", "bottom-5 left-[25%]", "top-44 right-[25%]", "top-5 right-5"].map((position, idx) => (
              <div key={idx} className={`absolute ${position} max-md:h-16 max-md:w-16 h-[8.688rem] w-[8.688rem] rounded-full circularbox`}></div>
            ))}
          </div>

          <div className="relative z-40">
            <Slider {...sliderSettings}>
              {Images.map((src, index) => {
                const nameIndex = isLegacyImages ? index + 1 : index;
                const customName = imageNames[nameIndex]?.trim();
                return (
                  <div key={index}>
                    <div className="flex flex-col items-center py-10 px-2 rounded-lg shadow-lg min-h-54 min-w-96">
                      <Image className="rounded-lg shadow-lg object-fill" src={`${process.env.NEXT_PUBLIC_Files_URL}/${src}`} width={500} height={500} alt={customName || `Image ${index + 1}`} />
                      {customName && (
                        <p className="mt-4 font-semibold text-[#a91846] text-center bg-white/90 px-4 py-2 rounded-full shadow-sm">
                          {customName}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </section>
      )}
    </section>
  );
};

export default ActivitiesPage;
