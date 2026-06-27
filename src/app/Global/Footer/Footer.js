import SocialMediaSidebar from "../Sidebaar/sidebaar";
import Fodata from "./Components/Fodata";
const fetchData = async () => {
    try {
      const [mainMenuRes, social_media, linkMenuRes,FooterLinks] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/mainmenu`, {
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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/submenulinks`, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${process.env.JWT_SECRET}`,
          },
          cache: 'no-store'

        
        }),

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/footerlinks`, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${process.env.JWT_SECRET}`,
          },
          cache: 'no-store'

        
        }),

      ]);
  
      if (!mainMenuRes.ok || !social_media.ok || !linkMenuRes.ok || !FooterLinks.ok) {
        throw new Error("Failed to fetch menu data");
      }
  
      const [mainMenu, social_media1, linkMenu, FooterLinksdata] = await Promise.all([
        mainMenuRes.json(),
        social_media.json(),
        linkMenuRes.json(),
        FooterLinks.json()
      ]);
  
      return { mainMenu, social_media1, linkMenu,FooterLinksdata };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { mainMenu: [], social_media1: [], linkMenu: [],FooterLinksdata : [] }; // Return empty arrays in case of error
    }
  };
const Footer =  async () => {
    const data = await fetchData();
    return (
      <>
       <Fodata data={data} FooterLinks={data.FooterLinksdata}/> 
       <SocialMediaSidebar data={data.social_media1}/>
      </>
       
    );
}

export default Footer;