
import DynamicPage from "./DynamicPage";

// ✅ Server-side Data Fetching
const fetchData = async (slug) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks/?link=${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JWT_SECRET}`,
      },
      cache: "no-store", // ✅ Ensure fresh data (Disable caching)
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
  const slug = Slug; // ✅ Get dynamic slug from URL
  const data = await fetchData(slug); // ✅ Pass slug to fetchData

  return <DynamicPage data={data} />;
}
