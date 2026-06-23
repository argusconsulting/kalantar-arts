import DynamicPage from "./DynamicPage";
import ChairmanPage from "./ChairmanPage";
import GovernmentPartnersPage from "./GovernmentPartnersPage";
import SocialPartnersPage from "./SocialPartnersPage";
import PhotoGalleryPage from "./PhotoGalleryPage";

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

  // ✅ Check FIRST, before fetching anything
  if (slug === "Chairman") {
    return <ChairmanPage />;
  }
  if (slug === "Government-Partners") {
    return <GovernmentPartnersPage />;
  }
  if (slug === "Social-Partners") {
    return <SocialPartnersPage />;
  }
if (slug === "Photo-Gallery") {
     return <PhotoGalleryPage />;
   }

  // Only fetch from API for non-static pages
  const data = await fetchData(slug);
  return <DynamicPage data={data} />;
}