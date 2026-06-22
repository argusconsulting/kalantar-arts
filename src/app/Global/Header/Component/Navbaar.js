"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { IoMenu, IoClose } from "react-icons/io5";
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});
const Navbaar = ({ data,SITE_DATA }) => {
  const [MainMenu, setMainMenu] = useState(data.mainMenu);
  const [SubMenu, setSubMenu] = useState(data.subMenu);
  const [LinkMenu, setLinkMenu] = useState(data.linkMenu);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [expandedMainMenuId, setExpandedMainMenuId] = useState(null);
  const [expandedSubMenuId, setExpandedSubMenuId] = useState(null);
  const pathname = usePathname();
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleMainMenu = (menuId) => {
    setExpandedMainMenuId(prev => prev === menuId ? null : menuId);
    setExpandedSubMenuId(null);
  };

  const toggleSubMenu = (submenuId) => {
    setExpandedSubMenuId(prev => prev === submenuId ? null : submenuId);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedMainMenuId(null);
    setExpandedSubMenuId(null);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  // Early return conditions moved after all hooks
  if (pathname.startsWith("/KL-Admin")) return null;
  if (pathname.startsWith("/Login")) return null;
  return (
   <>
   
   <header className={`${roboto.className} fixed left-0 top-0 right-0 z-[500] h-[7.5rem] flex flex-col items-center bg-white shadow-md`}>
   <section className=" flex justify-between items-center w-full h-9  md:px-14  px-5 border-b-2 border-dotted border-black" onMouseEnter={() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setHoveredMenu(null);
    }}>
    <div className=" flex gap-2">
      <Image src="/phone-flip.svg" height={20} width={20} alt="."/>
      <Link className=" md:text-sm text-xs" href={`tel:${SITE_DATA.contact_no}`}>Reach Out to Us : {SITE_DATA.contact_no}</Link>
    </div>
    <div className=" flex gap-2 items-center">
      <Link href="https://www.facebook.com/artkalantar/"><Image src="/Social-Icos/facebook.png" height={20} width={20} alt="."/></Link>
      <Link href="https://www.instagram.com/kalantarart"><Image src="/Social-Icos/instagram.png" height={20} width={20} alt="."/></Link>
      <Link  href="https://www.youtube.com/kalantarart"><Image src="/Social-Icos/youtube-brands.svg" height={20} width={20} alt="."/></Link>
      <Link href="https://in.linkedin.com/company/kalantar-art-foundation"><Image src="/Social-Icos/linkedin-brands.svg" height={20} width={20} alt="."/></Link>
    </div>
   </section>
    
      <div className="flex px-6 md:px-20 py-2 justify-between items-center relative w-full">
        <figure className="w-[5.125rem]" onMouseEnter={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setHoveredMenu(null);
        }}>
          <Link href="/">
            <Image src="/Logos/Kalantar-logo.svg" width={1000} height={1000} alt="Logo" />
          </Link>
        </figure>

        <nav className="hidden md:block">
          <ul className="flex gap-10 text-lg">
            <li className="cursor-pointer hover:text-pink-500" onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              setHoveredMenu(null);
            }}>
              <Link href="/">Home</Link>
            </li>
            {MainMenu.map((menu) => (
              <div 
                key={menu.id} 
                onMouseEnter={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                  }
                  setHoveredMenu(menu.id);
                }}
                onMouseLeave={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  timeoutRef.current = setTimeout(() => {
                    setHoveredMenu(null);
                  }, 150);
                }}
              >
                <li className="cursor-pointer hover:text-pink-500">{menu.title}</li>
                {SubMenu?.length > 0 && hoveredMenu === menu.id && (
                  <div className="absolute z-[500] flex left-1/2 -translate-x-1/2 top-16 bg-white rounded-md shadow-md p-6">
                    {SubMenu?.filter(submenu => submenu.main_menu_id === hoveredMenu).map((submenu, subIndex) => (
                      <div key={submenu.id} className={`pl-4 ${subIndex === 0 ? "" : "border-l-2 border-gray-300"}`}>
                        <h4 className={`text-xl font-medium ${submenu.IsLink === 1 ? 'text-transparent' : ''}`}>{submenu.title}</h4>
                        <ul className={`w-[15.875rem] mt-2 flex flex-col gap-y-2 ${submenu.IsLinks === true ? 'hidden' : ''}`}>
                          {LinkMenu.filter(linkItem => linkItem.sub_menu_id === submenu.id).map((item) => (
                            <Link
                              key={item.id}
                              href={
                                item.Custom_Link === 1
                                  ? item.link
                                  : item.customepage === 1
                                  ? `/${submenu.title.replace(/\s+/g, "-")}/${item.link.replace(/\s+/g, "-")}`
                                  : `/Pages/${item.link}`
                              }
                              
                              target={item.target === 1 ? "_blank" : "_self"}
                              className="hover:text-pink-500 px-1"
                            >
                              <div className="w-full flex">
                                <div className={`w-1/6 items-start mt-[0.625rem] flex justify-around ${submenu.IsLink === 1 ? 'hidden' : ''}`}>
                                  <div className="rounded-full h-2 w-2 bg-black"></div>
                                </div>
                                <span className={`${submenu.IsLink === 1 ? 'font-semibold text-lg' : 'text-base font-extralight'} w-5/6`}>
                                  {item.name}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <li className="cursor-pointer hover:text-pink-500" onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              setHoveredMenu(null);
            }}>
              <Link href="/Contact-Us">Contact Us</Link>
            </li>
          </ul>
        </nav>

        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-lg"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <IoClose size={40} color="#e4097f" /> : <IoMenu size={40} color="#e4097f" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-[6.5rem] bg-white shadow-lg w-[250px] p-4 md:hidden rounded-lg border border-gray-100 z-[500]"
          >
            <ul className="flex flex-col gap-2">
              <li className="cursor-pointer text-lg font-medium hover:text-pink-500 py-2">
                <Link href="/" onClick={closeMobileMenu}>Home</Link>
              </li>
              
              {MainMenu.map((menu) => (
                <div key={menu.id} className="overflow-hidden">
                  <motion.li 
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer text-lg font-medium hover:text-pink-500 flex items-center justify-between py-2"
                    onClick={() => toggleMainMenu(menu.id)}
                  >
                    <span>{menu.title}</span>
                    <motion.span
                      animate={{ rotate: expandedMainMenuId === menu.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    </motion.span>
                  </motion.li>

                  <AnimatePresence>
                    {expandedMainMenuId === menu.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 border-l-2 border-gray-100"
                      >
                        {SubMenu?.filter(submenu => submenu.main_menu_id === menu.id).map((submenu) => (
                          <div key={submenu.id} className="overflow-hidden">
                            <motion.div 
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center justify-between py-2 cursor-pointer"
                              onClick={() => toggleSubMenu(submenu.id)}
                            >
                              <h4 className="text-base font-medium hover:text-pink-500">
                                {submenu.title}
                              </h4>
                              <motion.span
                                animate={{ rotate: expandedSubMenuId === submenu.id ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                              </motion.span>
                            </motion.div>

                            <AnimatePresence>
                              {expandedSubMenuId === submenu.id && (
                                <motion.ul
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-full flex flex-col gap-y-1 ml-2"
                                >
                                  {LinkMenu.filter(linkItem => linkItem.sub_menu_id === submenu.id).map((item) => (
                                    <motion.li
                                      key={item.id}
                                      whileHover={{ x: 2 }}
                                    >
                                      <Link 
                                        href={
                                          item.Custom_Link === 1
                                            ? item.link
                                            : item.customepage === 1
                                            ? `/${submenu.title.replace(/\s+/g, "-")}/${item.link.replace(/\s+/g, "-")}`
                                            : `/Pages/${item.link}`
                                        }
                                        target={item.target === 1 ? "_blank" : "_self"}
                                        className="hover:text-pink-500 px-1 py-1 block text-sm"
                                        onClick={closeMobileMenu}
                                      >
                                        {item.name}
                                      </Link>
                                    </motion.li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <li className="cursor-pointer text-lg font-medium hover:text-pink-500 py-2">
                <Link href="/Contact-Us" onClick={closeMobileMenu}>Contact Us</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
   </>
  );
};

export default Navbaar;