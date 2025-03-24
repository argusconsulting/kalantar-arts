"use client"; // Ensure this is a client component for interactivity

import React from "react";
import { usePathname } from "next/navigation";
const SocialMediaSidebar = ({ data }) => {
  const socialLinks = [
    { name: "Facebook", icon: "facebook", url: "https://www.facebook.com/artkalantar/" },
    { name: "Youtube", icon: "youtube", url: "https://www.youtube.com/kalantarart" },
    { name: "LinkedIn", icon: "linkedin", url: "https://in.linkedin.com/company/kalantar-art-foundation" },
    { name: "Instagram", icon: "instagram", url: "https://www.instagram.com/kalantarart" },
  ];
  const pathname = usePathname();
  // return null when route start with /admin
  if (pathname.startsWith("/KL-Admin")) return null;
  if (pathname.startsWith("/Login")) return null;
  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 p-2 bg-gray-800 text-white rounded-r-lg shadow-lg z-50">
      {data.map((link, index) => (
        <a
          key={index}
          href={link.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg transition-all duration-300 group w-12 hover:w-48 overflow-hidden"
        >
          <i className={`fab fa-${link.name.toLowerCase()} text-xl min-w-[24px]`}></i>

          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialMediaSidebar;