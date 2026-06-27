import DynamicPage from "./DynamicPage";
import ChairmanPage from "./ChairmanPage";
import GovernmentPartnersPage from "./GovernmentPartnersPage";
import SocialPartnersPage from "./SocialPartnersPage";
import PhotoGalleryPage from "./PhotoGalleryPage";
import VideoGalleryPage from "./VideoGalleryPage";
import ActivitiesPage from "../../Activities/[Slug]/ActivitiesPage";
import ExecutiveTeamPage from "./ExecutiveTeamPage";

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

const fetchSubMenus = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenu`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JWT_SECRET}`,
      },
      cache: "no-store",
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching submenus:", error);
    return [];
  }
};

// ✅ Page Component (Server Component)
export default async function Page({ params }) {
  const { Slug } = await params;
  const slug = decodeURIComponent(Slug);

  // ✅ Fetch data from API for ALL pages so custom pages can use CMS data
  const data = await fetchData(slug);

  // ✅ Check FIRST, before fetching anything
  if (slug === "Chairman" || slug === "Heartfelts-Chairman" || slug === "From-desk-mentor-chief") {
    return <ChairmanPage data={data} />;
  }
  if (slug === "Government-Partners" || slug === "Government Partners") {
    return <GovernmentPartnersPage data={data} />;
  }
  if (slug === "Social-Partners" || slug === "Social Partners") {
    return <SocialPartnersPage data={data} />;
  }
  if (slug === "Photo-Gallery" || slug === "Photo Gallery") {
    return <PhotoGalleryPage data={data} />;
  }
  if (slug === "Video-Gallery" || slug === "Video Gallery") {
    return <VideoGalleryPage data={data} />;
  }
  if (slug === "Executive-Team" || slug === "Executive Team" || slug === "The-Founders" || slug === "The-Advisors") {
    return <ExecutiveTeamPage data={data} />;
  }

  // ✅ Automatically render Activities UI for pages under "Our Activities" (main_menu_id === 2)
  if (data && data.length > 0) {
    const subMenus = await fetchSubMenus();
    const currentSubMenu = subMenus.find(s => s.id === data[0].sub_menu_id);
    if (currentSubMenu && currentSubMenu.main_menu_id === 2) {
      return <ActivitiesPage data={data[0]} />;
    }
  }

  return <DynamicPage data={data} />;
}