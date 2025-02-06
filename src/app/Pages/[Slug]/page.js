"use client";

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
    <div className="mt-[14rem] px-4 lg:px-20">
      {filteredData.length > 0 && filteredData[0]?.Richtext ? (
        <div
          dangerouslySetInnerHTML={{
            __html: filteredData[0].Richtext,
          }}
        />
      ) : (
        <p>No content available.</p>
      )}
    </div>
  );
};

export default Page;
