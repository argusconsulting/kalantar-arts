import Petals from "./Components/Petals";
import HeroSection from "./Components/HeroSection";
import Headlight from "./Components/Higlight";
import Slider from "./Components/Slider";
import ArtInitiatives from "./Components/ArtInitiativesBlock";
import ArtPurpose from "./Components/Artpurpuse";
import Gallary from "./Components/Gallary";
import PopupComponent from "./Components/Popup";

const fetchData = async () => {
  try {
    const [
      resHeroSlider,
      resPetals,
      resHighlight,
      resSlider,
      resInitiatives,
      resArtPurpose,
      resGallery,
    ] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Hero_Slider`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Petals`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/highlight/1`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Slider`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/Initiatives`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/ArtPurpose/1`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
        cache: 'no-store',
      }),

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.JWT_SECRET}`,
        },
        cache: 'no-store',
      }),
    ]);

    if (
      !resHeroSlider.ok ||
      !resPetals.ok ||
      !resHighlight.ok ||
      !resSlider.ok ||
      !resInitiatives.ok ||
      !resArtPurpose.ok ||
      !resGallery.ok
    ) {
      throw new Error("Failed to fetch menu data");
    }

    const [
      HeroSlider,
      Petals6,
      highlight1,
      Slider1,
      Initiativesdata,
      ArtPurposedata,
      gallerydata,
    ] = await Promise.all([
      resHeroSlider.json(),
      resPetals.json(),
      resHighlight.json(),
      resSlider.json(),
      resInitiatives.json(),
      resArtPurpose.json(),
      resGallery.json(),
    ]);

    return { HeroSlider, Petals6, highlight1, Slider1, Initiativesdata, ArtPurposedata, gallerydata };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      HeroSlider: [],
      Petals6: [],
      highlight1: [],
      Slider1: [],
      Initiativesdata: [],
      ArtPurposedata: [],
      gallerydata: [],
    };
  }
};

const HomePage = async () => {
  const data = await fetchData();

  return (
    <>
      <HeroSection data={data} />
      {/* <Slider Slider1={data.Slider1}/> */}
      <ArtPurpose data={data.ArtPurposedata} />
      <Petals Petals6={data.Petals6} />
      <ArtInitiatives data={data.Initiativesdata} />
      <Gallary data={data.gallerydata} />
      <Headlight highlight1={data.highlight1} />
      <PopupComponent/>
    </>
  );
};

export default HomePage;
