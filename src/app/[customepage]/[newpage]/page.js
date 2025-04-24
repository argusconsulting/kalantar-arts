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
  const slug = params.newpage; // e.g., "The-Founders"

  const pageData = await fetchData(slug);



  if (!pageData) {
    return <p className="text-center text-xl text-red-500 mt-20">No data found for this page.</p>;
  }

  return <TeamPage data={pageData.json_content} title={pageData.slug} />;
}
