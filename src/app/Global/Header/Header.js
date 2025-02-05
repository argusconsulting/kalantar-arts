import Navbaar from "./Component/Navbaar";

const fetchData = async () => {
  try {
    const [mainMenuRes, subMenuRes, linkMenuRes] = await Promise.all([
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
    ]);

    if (!mainMenuRes.ok || !subMenuRes.ok || !linkMenuRes.ok) {
      throw new Error("Failed to fetch menu data");
    }

    const [mainMenu, subMenu, linkMenu] = await Promise.all([
      mainMenuRes.json(),
      subMenuRes.json(),
      linkMenuRes.json(),
    ]);

    return { mainMenu, subMenu, linkMenu };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { mainMenu: [], subMenu: [], linkMenu: [] }; // Return empty arrays in case of error
  }
};

const Header = async () => {
  const data = await fetchData();
  
   // Debugging purpose

  return <Navbaar data={data} />;
};

export default Header;
