"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const Page = () => {
  const [data, setData] = useState([]);
  const pathname = usePathname();
  const url = useMemo(() => pathname.split("/")[2], [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.JWT_SECRET}`,
          },
          cache: "no-store",
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [pathname]);

  const filteredData = useMemo(() => data.filter((item) => item.link === url), [data, url]);

  return (
   <>
      {filteredData.length > 0 && filteredData[0]?.Richtext ? (
        <div className="mt-[14rem] px-4 lg:px-20">
        <div
          dangerouslySetInnerHTML={{
            __html: filteredData[0].Richtext,
          }}
        />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
        <h2 className="text-5xl font-bold text-red-600">404</h2>
        <p className="text-xl mt-2">Oops! The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="mt-4 px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Return Home
        </Link>
      </div>
      )}
    </>
  );
};

export default Page;
