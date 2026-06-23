import TeamPage from "./TeamPage";

// ✅ Fetch page data using slug param
const fetchData = async (slug) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dynamic_pages/?slug=${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JWT_SECRET}`,
      },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const result = await response.json();
    return result.length > 0 ? result[0] : null;
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