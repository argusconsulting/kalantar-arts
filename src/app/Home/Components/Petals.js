"use client";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";

const Petals = ({ Petals6 }) => {
  if (!Petals6 || Petals6.length === 0) {
    return <div>Loading...</div>;
  }

  return (

    <section className="w-full h-full items-center">
      <div className="flex items-center max-md:my-2 max-md:flex-col max-md:gap-3 mt-6 mb-20 justify-center">
        <figure className="w-24 max-md:w-16">
          <Image src="/Logos/Art-logo.svg" width={1000} height={1000} alt="Art Logo" />
        </figure>
        <h2 className="text-4xl max-md:text-2xl text-[#2A2A2A] font-normal">
          The <span className="font-semibold text-[#E84691]">6 Petals</span> of Kalantar
        </h2>
      </div>

      <section className="w-full  mt-16 md:mt-0 h-full clip-wave-top  items-center">
        {/* Header */}


        {/* Diamond-shaped Content */}
        <div className=" relative w-full h-full grid md:grid-cols-2 bg-[#e84691]  py-20 max-md:grid-cols-1 max-md:px-2 px-20 gap-10">
         
         
         <Image className=" absolute w-full -top-10" src="/Rectangle 147.png" alt="" width={1000} height={1000}/>
          {Petals6.map((item, index) => (
            <div key={index} className="w-full flex flex-col items-center justify-center">
              {/* Diamond Shape */}
              <div className="relative">
                {/* Outer Border */}
                <div className="absolute inset-0 transform scale-105 bg-yellow-400 clip-diamond"></div>
                {/* Content Inside Diamond */}
                <div className="clip-diamond bg-white w-[20rem] lg:w-[30.75rem] h-[12rem] lg:h-[18.75rem] flex items-center justify-center">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.hero_img}`}
                    width={1000}
                    height={1000}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Below Content */}
              <div className="flex text-white my-3 gap-5 flex-col items-center justify-center">
                <h2 className="text-4xl max-md:text-2xl font-bold text-center">{item.title}</h2>
                <Image
                  src="/Uploads/Vector 35.svg"
                  alt="Vector"
                  width={1000}
                  height={1000}
                  className="w-[60%]"
                />
                <h3 className="font-medium text-3xl max-md:text-xl text-center">{item.subtitle}</h3>
                <Link
                  href={`/Petals/${item.slug}`}
                  className="flex opacity-70 hover:opacity-100 items-center font-normal text-base justify-center"
                >
                  Read More
                  <IoIosArrowRoundForward color="#FF9D00" size={30} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Petals;
