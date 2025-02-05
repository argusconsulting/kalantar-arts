"use client"
import { IoIosArrowRoundForward } from "react-icons/io";
import { usePathname } from "next/navigation";
const Donate = () => {
    const pathname = usePathname();

    if (pathname.startsWith("/Admin")) return null;
    return (
        <button className=" fixed bottom-10 right-6 z-50 flex items-center justify-center h-14  max-md:text-sm w-40 max-md:h-12 max-md:w-28 rounded-full text-xl font-semibold text-white bg-[#E4097F] hover:bg-pink-400">
            Donate <IoIosArrowRoundForward size={30} />
        </button>
    );
}

export default Donate;