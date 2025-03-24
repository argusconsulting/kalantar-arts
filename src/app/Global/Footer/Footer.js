import SocialMediaSidebar from "../Sidebaar/sidebaar";
import Fodata from "./Components/Fodata";
const fetchData = async () => {
    try {
      const [mainMenuRes, social_media, linkMenuRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/MainMenu`, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${process.env.JWT_SECRET}`,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/social_media`, {
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
  
      if (!mainMenuRes.ok || !social_media.ok || !linkMenuRes.ok) {
        throw new Error("Failed to fetch menu data");
      }
  
      const [mainMenu, social_media1, linkMenu] = await Promise.all([
        mainMenuRes.json(),
        social_media.json(),
        linkMenuRes.json(),
      ]);
  
      return { mainMenu, social_media1, linkMenu };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { mainMenu: [], social_media1: [], linkMenu: [] }; // Return empty arrays in case of error
    }
  };
const Footer =  async () => {
    const data = await fetchData();
    return (
      <>
       <Fodata data={data}/> 
       <SocialMediaSidebar data={data.social_media1}/>
      </>
       
    );
}

export default Footer;