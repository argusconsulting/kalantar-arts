import DynamicPage from "./DynamicPage";
import ChairmanPage from "./ChairmanPage";
import GovernmentPartnersPage from "./GovernmentPartnersPage";
import SocialPartnersPage from "./SocialPartnersPage";
import PhotoGalleryPage from "./PhotoGalleryPage";
import VideoGalleryPage from "./VideoGalleryPage";

// ✅ Server-side Data Fetching
const fetchData = async (slug) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks/?link=${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JWT_SECRET}`,
      },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// ✅ Page Component (Server Component)
export default async function Page({ params }) {
  const { Slug } = await params;
  const slug = Slug;

  // ✅ Fetch data from API for ALL pages so custom pages can use CMS data
  const data = await fetchData(slug);

  // ✅ Check FIRST, before fetching anything
  if (slug === "Chairman" || slug === "Heartfelts-Chairman") {
    return <ChairmanPage data={data} />;
  }
  if (slug === "Government-Partners") {
    return <GovernmentPartnersPage data={data} />;
  }
  if (slug === "Social-Partners") {
    return <SocialPartnersPage data={data} />;
  }
  if (slug === "Photo-Gallery") {
    return <PhotoGalleryPage data={data} />;
  }
  if (slug === "Video-Gallery") {
    return <VideoGalleryPage data={data} />;
  }

  return <DynamicPage data={data} />;
}