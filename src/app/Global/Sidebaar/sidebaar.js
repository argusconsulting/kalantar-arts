"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const SocialMediaSidebar = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide on admin and login pages
  if (pathname.startsWith("/KL-Admin") || pathname.startsWith("/Login")) return null;

  return (
    <div 
      className={`fixed left-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 p-1 bg-[#e84691]  bg-opacity-80 text-white rounded-r-lg shadow-lg z-50 transition-all duration-300
        ${isMobile ? 'w-12' : isHovered ? 'w-48' : 'w-12'}
      `}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {data.map((link, index) => (
        <a
          key={index}
          href={link.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg transition-all duration-300 group"
        >
          
          
                    <Image
                      src={`${process.env.NEXT_PUBLIC_Files_URL}/${link.image}`}
                      alt={link.name}
                      width={28}
                      height={28}
                      className="object-contain w-6 sm:w-8 "
                    />
                 
          <span className={`transition-opacity duration-300 whitespace-nowrap
            ${isMobile ? 'hidden' : isHovered ? 'opacity-100' : 'opacity-0'}
          `}>
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialMediaSidebar;