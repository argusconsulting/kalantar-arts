"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SubPageHero = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (pathname === "/" || pathname.startsWith("/KL-Admin") || pathname.startsWith("/Login")) {
    return null;
  }

  return (
    <section
      className="relative flex justify-center items-center pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden linearGradient px-4 md:px-5"
      style={{ backgroundPosition: "center bottom" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 w-full max-w-7xl relative">
        <div className="flex mt-12 md:mt-0 justify-center items-center p-2 relative">
          <div className="border-[0.5rem] border-white w-full h-[15rem] md:h-[22rem] overflow-hidden relative">
            <Image
              src="/SubMenuHeaderImg.jpeg"
              alt="Subpage Hero"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-4 text-center md:text-left">
          <div className="w-full">
            <div className="w-full flex justify-start items-start">
              <Image
                src="/Other-Icons/“.svg"
                className="inline-block w-10 h-10 align-top"
                alt="Quote Start"
                width={10}
                height={10}
              />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter p-2 text-white leading-relaxed opacity-90 text-left">
              Mission KALANTAR - an incredible and ongoing journey
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-justify p-2 text-white leading-relaxed opacity-90">
              As the name itself suggests Kalantar (meaning &ldquo; the art within us &rdquo;) - is a mission to bring a huge &quot;change through art&quot; (Kala-antar) in the life of individuals, in the society and in the world on large.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-justify p-2 text-white leading-relaxed opacity-90 mt-2">
              We are on the journey, and invite you all to be a part of this incredible journey called Mission KALANTAR
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubPageHero;
