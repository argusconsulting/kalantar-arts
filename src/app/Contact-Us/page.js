import ContactUs from "./ContactUs";


const fetchData = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SITE_DATA/1`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.JWT_SECRET}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Hero_Slider data");
    }

    const SiteData = await response.json();
    return { SiteData };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { SiteData: [] }; // Return empty array on error
  }
};

const Page = async () => {
  const { SiteData } = await fetchData();

  // console.log("sitedata",SiteData);

  return (
    <>
    <ContactUs data={SiteData}/>
    </>
  );
};

export default Page;
