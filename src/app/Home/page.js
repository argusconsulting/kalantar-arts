
import Petals from "./Components/Petals";
import HeroSection from "./Components/HeroSection";
import Headlight from "./Components/Higlight";
import Slider from "./Components/Slider";
import ArtInitiatives from "./Components/ArtInitiativesBlock";
import ArtPurpose from "./Components/Artpurpuse";
import Gallary from "./Components/Gallary";

const fetchData = async () => {
  try {
    const [Hero_Slider, Petals, highlight,Slider,Initiatives] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Hero_Slider`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
          cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Petals`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
          cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/highlight/1`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
          cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Slider`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
          cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Initiatives`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
          cache: 'no-store'
      }),
    ]);

    if (!Hero_Slider.ok || !Petals.ok || !highlight.ok || !Slider.ok || !Initiatives.ok) {
      throw new Error("Failed to fetch menu data");
    }

    const [HeroSlider, Petals6, highlight1,Slider1,Initiativesdata] = await Promise.all([
      Hero_Slider.json(),
      Petals.json(),
      highlight.json(),
      Slider.json(),
      Initiatives.json()
    ]);

    return { HeroSlider, Petals6, highlight1,Slider1,Initiativesdata };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { HeroSlider: [], Petals6: [], highlight1: [],Slider1: [], Initiativesdata: [] }; // Return empty arrays in case of error
  }
};

const HomePage = async () => {
  const data = await fetchData();
  


  return(
    <>
  
  <HeroSection data={data}/>

  {/* <Slider Slider1={data.Slider1}/> */}
  <ArtPurpose/>
  
 
  <Petals Petals6={data.Petals6} />
  <ArtInitiatives data={data.Initiativesdata}/>
  <Gallary/>
  <Headlight highlight1={data.highlight1}/>
  </>
  )
  
  
};

export default HomePage;
