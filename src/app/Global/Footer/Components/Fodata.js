"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Fodata = ({data}) => {
  const linkGroups = [
  
    {
      title: "Contact Us",
      links: [
        { href: "/faq", label: "FAQ" },
        { href: "/contact", label: "Contact" },
        { href: "/terms", label: "Terms of Service" },
      ],
    },
  ];

  const socialMediaIcons = [
    { href: "#", label: "Facebook", icon: "social (3).svg" },
    { href: "#", label: "Instagram", icon: "social (2).svg" },
    { href: "/jhdf", label: "YouTube", icon: "social (1).svg" },
    { href: "#", label: "LinkedIn", icon: "social.svg" },
  ];

  const pathname = usePathname();

  // return null when route start with /admin
  if (pathname.startsWith("/KL-Admin")) return null;
  if (pathname.startsWith("/Login")) return null;
  return (
    <footer className="bg-white">
      <section className="w-full flex flex-wrap px-8 sm:px-16 lg:px-40 py-10 lg:py-16">
        <div className="w-full lg:w-3/5 flex flex-col justify-between mb-8 lg:mb-0 px-4">
          <Link href="/">
            <Image
              src="/Logos/Kalantar-logo.svg"
              width={1000}
              height={1000}
              alt="Logo"
              className="w-32 lg:w-40"
            />
          </Link>
          <p className="text-gray-600 mt-4 lg:mt-6">
            To bring a phenomenal impact on society by practicing all the 64
            traits of art for the betterment of mankind.
          </p>
          <nav className="mt-6">
            <ul className="flex gap-6">
              
              {data?.social_media1?.map((icon, index) => (
                <li key={index} className="w-10 h-10 flex items-center justify-center overflow-hidden p-1">
                  <Link
                    href={icon.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={` ${icon.name === 'Facebook' && 'p-1'}`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_Files_URL}/${icon.image}`}
                      alt={icon.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    
                  </Link>
                  
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="w-full lg:w-2/5 flex flex-wrap justify-between px-4">
         
            <nav  className="w-1/2 lg:w-auto mb-8 lg:mb-0">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Links
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
              <li >
                    <Link href="/" className="hover:text-blue-700 transition-colors duration-300 ease-in-out">Home</Link>
                  </li>
                {data.mainMenu.map((link, subIndex) => (
                  <li key={subIndex}>
                    <Link href="/" className="hover:text-blue-700 transition-colors duration-300 ease-in-out">{link.title}</Link>
                  </li>
                ))}
                 <li >
                    <Link href="/Contact-Us" className="hover:text-blue-700 transition-colors duration-300 ease-in-out">Contact Us</Link>
                  </li>
              </ul>
            </nav>
         
        </div>
      </section>
      <div className=" w-full">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {/* CIN Number */}
          <div className="flex items-center gap-2">
            <span className="font-semibold  text-black">CIN No. :</span>
            <span className="text-gray-800">U85300UP2022NPL168405</span>
          </div>

          {/* NGO Darpan Unique ID */}
          <div className="flex items-center gap-2">
            <span className="font-semibold  text-black">NGO Darpan Unique ID :</span>
            <span className="text-gray-800">UP/2022/0327989</span>
          </div>

          {/* Section 80G Unique Registration Number */}
          <div className="flex items-center gap-2">
            <span className="font-semibold  text-black">Section 80G unique registration number :</span>
            <span className="text-gray-800">AAJCK6972BF20221</span>
          </div>
        </div>
      </div>
      <section className="bg-gray-100 py-6">
        <div className="flex flex-col items-center text-center text-gray-600">
          <Link
            href="https://app.theargusconsulting.com/"
            target="_blank"
            rel="noopener"
            className="flex flex-col items-center"
          >
            <Image
              src="/Logos/Argus_logo.png"
              alt="The Argus Consulting Logo"
              width={80}
              height={80}
              className="mb-4"
             
            />
            <span className="text-sm">
              &#169; {new Date().getFullYear()} Kalantar Art | Powered by Argus
              Consulting
            </span>
          </Link>
        </div>
      </section>
    </footer>
  );
};

export default Fodata;
