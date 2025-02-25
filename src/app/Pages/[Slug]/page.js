"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const url = useMemo(() => pathname.split("/")[2], [pathname]);


  useEffect(() => {
    // Ensure page scrolls to top when it loads
   

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
        
        // Artificial delay before setting data
        setTimeout(() => {
          setData(result);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  const filteredData = useMemo(() => data.filter((item) => item.link === url), [data, url]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 px-4 lg:px-20">
      {loading ? (
        <p className="text-xl text-gray-500">Loading...</p>
      ) : filteredData.length > 0 && filteredData[0]?.Richtext ? (
        <div className="w-full max-w-4xl">
          <div dangerouslySetInnerHTML={{ __html: filteredData[0].Richtext }} />
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <h2 className="text-5xl font-bold text-red-600">404</h2>
          <p className="text-xl mt-2">Oops! The page you&#39;re looking for doesn&#39;t exist.</p>
          <Link
            href="/"
            className="mt-4 px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Return Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
