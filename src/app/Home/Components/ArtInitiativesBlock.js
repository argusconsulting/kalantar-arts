"use client";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ArtInitiatives({ data }) {
  const settings = {
    dots: true,
    infinite: data?.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: data?.length > 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: data?.length > 1,
        }
      }
    ]
  };

  const sortedData = [...(data || [])].sort((a, b) => a.id - b.id);

  return (
    <div className="relative mx-auto px-4 md:px-20 py-8">
      {/* Header */}
      <div className="mb-6 relative">
        <div className="border-l-4 border-pink-500 pl-4">
          <p className="text-pink-500 font-medium">Latest Happenings</p>
          <h1 className="text-3xl font-serif font-medium text-gray-800 mt-1">
            Art, Events & Initiatives
          </h1>
        </div>
        <p className="text-gray-600 mt-3 max-w-3xl">
          Learn about projects using art for education, rehabilitation, and positive change in society.
        </p>
      </div>

      {/* Cards Slider */}
      <div className="mt-8 relative art-slider-container">
        {sortedData.length > 0 && (
          <Slider {...settings}>
            {sortedData.map((item, index) => (
              <div key={index} className="px-3 pb-8 pt-2">
                <div className="rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 bg-white h-full flex flex-col border border-gray-100">
                  <div className="relative h-48 sm:h-56 w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.image}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 bg-white flex-1 flex flex-col">
                    <div className="flex items-start mb-4">
                      <div className="flex flex-col items-center mr-5 border-r-4 border-[#FFC909] pr-5">
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">{item.date_month}</span>
                        <span className="text-3xl font-extrabold text-pink-600">{item.date_day}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight pt-1">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .art-slider-container .slick-dots li button:before {
          font-size: 10px;
          color: #d1d5db;
          opacity: 1;
        }
        .art-slider-container .slick-dots li.slick-active button:before {
          color: #db2777; /* pink-600 */
        }
        .art-slider-container .slick-track {
          display: flex !important;
        }
        .art-slider-container .slick-slide {
          height: inherit !important;
          display: flex !important;
          justify-content: center;
        }
        .art-slider-container .slick-slide > div {
          width: 100%;
          display: flex;
        }
        .art-slider-container .slick-prev:before, .art-slider-container .slick-next:before {
          color: #db2777; /* pink-600 */
          font-size: 24px;
        }
        .art-slider-container .slick-prev {
          left: -15px;
          z-index: 10;
        }
        .art-slider-container .slick-next {
          right: -15px;
          z-index: 10;
        }
      `}} />
    </div>
  );
}
