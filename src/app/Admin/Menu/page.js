import MenuData from "./Components/MenuData";

const fetchData = async () => {
  try {
    const [mainMenuRes, subMenuRes, linkMenuRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/MainMenu`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenu`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
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

const Page = async () => {
  const data = await fetchData();
  
   // Debugging purpose

  return(
   <>
   <MenuData data={data} />
   </>
  );
};

export default Page;
