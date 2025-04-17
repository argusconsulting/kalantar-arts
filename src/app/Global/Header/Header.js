import Navbaar from "./Component/Navbaar";

const fetchData = async () => {
  try {
    const [mainMenuRes, subMenuRes, linkMenuRes,SITE_DATA] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/MainMenu`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
          cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenu`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
          cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
          cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/SITE_DATA/1`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
          cache: 'no-store'
      }),
    ]);

    if (!mainMenuRes.ok || !subMenuRes.ok || !linkMenuRes.ok) {
      throw new Error("Failed to fetch menu data");
    }

    const [mainMenu, subMenu, linkMenu,SITE_DATA1] = await Promise.all([
      mainMenuRes.json(),
      subMenuRes.json(),
      linkMenuRes.json(),
      SITE_DATA.json()
    ]);

    return { mainMenu, subMenu, linkMenu,SITE_DATA1 };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { mainMenu: [], subMenu: [], linkMenu: [],SITE_DATA1:[] }; // Return empty arrays in case of error
  }
};

const Header = async () => {
  const data = await fetchData();
  
   // Debugging purpose

  return <Navbaar data={data} SITE_DATA={data.SITE_DATA1} />;
};

export default Header;
