"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMenu,IoClose  } from "react-icons/io5";
const Navbaar = ({data}) => {
  const [MainMenu, setMainMenu] = useState(data.mainMenu);
  const [SubMenu, setSubMenu] =useState(data.subMenu);
  const [LinkMenu, setLinkMenu] =useState(data.linkMenu);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({}); // Track expanded menus
  const pathname = usePathname();




  if (pathname.startsWith("/KL-Admin")) return null;
  if (pathname.startsWith("/Login")) return null;

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId], // Toggle the expanded state
    }));
  };

 
  return (
    <header className="fixed left-0 top-0 right-0 z-[500] h-[7.5rem] flex items-center px-6 md:px-20 bg-white shadow-md" onMouseLeave={() => setHoveredMenu(null)}>
      <div className="flex justify-between items-center relative w-full">
        <figure className="w-[7.125rem]">
          <Link href="/">
            <Image src="/Logos/Kalantar-logo.svg" width={1000} height={1000} alt="Logo" />
          </Link>
        </figure>

        <nav className="hidden md:block">
          <ul className="flex gap-10 text-lg">
            
              <li  className="cursor-pointer hover:text-pink-500">
                <Link href={`/`}>Home</Link>
              </li>
          
            {MainMenu.map((menu, index) => (
              <div key={index} onMouseEnter={() => setHoveredMenu(menu.id)}>
                <li className="cursor-pointer hover:text-pink-500">{menu.title}</li>
                {SubMenu?.length > 0 && hoveredMenu === menu.id && (
                  <div className="absolute z-[500] flex right-2 top-16 bg-white rounded-md shadow-md p-6">
                    {SubMenu?.filter(submenu => submenu.main_menu_id === hoveredMenu).map((submenu, subIndex) => (
                      <div key={subIndex} className={`pl-4 ${subIndex === 0 ? "" : "border-l-2 border-gray-300"} `}>
                        <h4 className={`text-xl font-medium ${submenu.IsLink === 1 ? 'text-transparent' : ''}`}>{submenu.title}</h4>
                        <ul className={`w-[15.875rem] mt-2 flex flex-col gap-y-2 ${submenu.IsLinks === true ? 'hidden' : ''}`}>
                          {LinkMenu.filter(linkItem => linkItem.sub_menu_id === submenu.id).map((item, itemIndex) => (
                            
                            
                              item.Custom_Link === 1 ? (
                                <Link href={item.link} key={itemIndex} target={item.target} className="hover:text-pink-500 px-1">
                              <div className="w-full flex">
                                <div className={`w-1/6 items-start mt-[0.625rem] flex justify-around ${submenu.IsLink === 1 ? 'hidden' : ''}`}>
                                  <div className="rounded-full h-2 w-2 bg-black"></div>
                                </div>
                                <span className={`${submenu.IsLink === 1 ? ' font-semibold text-lg' : 'text-base font-extralight'} w-5/6 `}>{item.name}</span>
                              </div>
                            </Link>
                              ):(

                                <Link 
                              key={itemIndex} 
                              href={item.Custom_Link === 1 ? item.link : `/Pages/${item.link}`} 
                              target={item.target === 1 ? "_blank" : "_self"} 
                              className="hover:text-pink-500 px-1"
                            >
                              <div className="w-full flex">
                                <div className={`w-1/6 items-start mt-[0.625rem] flex justify-around ${submenu.IsLink === 1 ? 'hidden' : ''}`}>
                                  <div className="rounded-full h-2 w-2 bg-black"></div>
                                </div>
                                <span className={`${submenu.IsLink === 1 ? ' font-semibold text-lg' : 'text-base font-extralight'} w-5/6 `}>{item.name}</span>
                              </div>
                            </Link>
                              )
                            
                            
                            
                            
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <li  className="cursor-pointer hover:text-pink-500">
                <Link href={`/Contact-Us`}>Contact Us</Link>
              </li>
          </ul>
        </nav>

        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-lg">
            {isMobileMenuOpen ? <IoClose size={40} color="#e4097f" /> : <IoMenu size={40} color="#e4097f"/>}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute right-0 top-[6.5rem] bg-white shadow-md w-[250px] p-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {MainMenu.map((menu, index) => (
              <div key={index}>
                <li className="cursor-pointer text-lg hover:text-pink-500" onClick={() => toggleMenu(menu.id)}>
                  {menu.title}
                </li>
                {expandedMenus[menu.id] && SubMenu?.length > 0 && (
                  <div className="pl-4">
                    {SubMenu?.filter(submenu => submenu.main_menu_id === menu.id).map((submenu, subIndex) => (
                      <div key={subIndex}>
                        <h4 className="text-base font-medium">{submenu.title}</h4>
                        {expandedMenus[submenu.id] && (
                          <ul className="w-full mt-2 flex flex-col gap-y-2">
                            {LinkMenu.filter(linkItem => linkItem.sub_menu_id === submenu.id).map((item, itemIndex) => (
                              <Link href={`/Pages/${item.link}`} key={itemIndex} target={item.target} className="hover:text-pink-500 px-1">
                                <span className="text-sm">{item.name}</span>
                              </Link>
                            ))}
                          </ul>
                        )}
                        <button onClick={() => toggleMenu(submenu.id)} className="text-sm text-gray-500">
                          {expandedMenus[submenu.id] ? "Collapse" : "Expand"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbaar;