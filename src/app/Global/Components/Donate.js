"use client";

import { IoIosArrowRoundForward } from "react-icons/io";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Donate = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/Admin")) return null;

  return (
    <motion.button
      animate={{
        y: [0, -10, 0], // Moves up and down slightly
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }, // Faster bounce effect
      }}
      className="fixed bottom-10 right-6 z-50 flex items-center justify-center h-14 w-40 max-md:h-12 max-md:w-28 rounded-full text-xl font-semibold text-white bg-[#E4097F] hover:bg-pink-400 shadow-lg transition-all"
    >
      Donate <IoIosArrowRoundForward size={30} className="ml-1" />
    </motion.button>
  );
};

export default Donate;
