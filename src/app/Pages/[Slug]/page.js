"use client"
import { usePathname } from "next/navigation";
import { useMemo } from "react";
const page = () => {
      const pathname = usePathname();
      const url = useMemo(() => pathname.split("/")[2], [pathname]);

      console.log(url);
    
    return (
        <div>
            Enter
        </div>
    );
}

export default page;