import TeamPage from "./TeamPage";
import ChairmanPage from "./ChairmanPage";
import SocialPartnersPage from "./SocialPartnersPage";

// ✅ Fetch page data using slug param
const fetchData = async (slug) => {
  try {
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dynamic_pages/?slug=${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JWT_SECRET}`,
      },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    let result = await response.json();
    if (result.length > 0) return result[0];

    // Fallback: Try with spaces instead of dashes if the slug has dashes
    if (slug.includes("-")) {
      const slugWithSpaces = slug.replace(/-/g, " ");
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dynamic_pages/?slug=${slugWithSpaces}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
        cache: "no-store",
      });
      if (response.ok) {
        result = await response.json();
        if (result.length > 0) return result[0];
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// ✅ Page Component
export default async function Page({ params }) {
  const { newpage } = await params;
  const slug = newpage; // e.g., "The-Founders"

  const pageData = await fetchData(slug);

  if (!pageData) {
    return <p className="text-center text-xl text-red-500 mt-20">No data found for this page.</p>;
  }

  let data = pageData.json_content;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing json_content:", error);
      data = [];
    }
  }

  const isFounders = slug?.toLowerCase().includes("founder");

  return (
    <TeamPage
      data={data || []}
      title={pageData.slug}
      subtitle={
        isFounders
          ? "Two passionate leaders united by a vision to empower society through art, creativity, and social transformation."
          : undefined
      }
    />
  );
}