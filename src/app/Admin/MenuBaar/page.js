"use client"
import { useEffect, useState } from "react";

const Header = () => {
  const [data, setData] = useState({
    mainMenu: [],
    subMenu: [],
    linkMenu: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mainMenuRes, subMenuRes, linkMenuRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/MainMenu`, {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenu`, {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks`, {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
          }),
        ]);

        if (!mainMenuRes.ok || !subMenuRes.ok || !linkMenuRes.ok) {
          throw new Error("Failed to fetch menu data");
        }

        const [mainMenu, subMenu, linkMenu] = await Promise.all([
          mainMenuRes.json(),
          subMenuRes.json(),
          linkMenuRes.json(),
        ]);

        setData({ mainMenu, subMenu, linkMenu });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* Render your menu components here */}
      
    </div>
  );
};

export default Header;
