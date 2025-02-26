
import Petal from "./Petal";

// ✅ Server-side Data Fetching
const fetchData = async (slug) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Petals/?slug=${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JWT_SECRET}`,
      },
      cache: "no-store", // ✅ Ensures fresh data (Disable caching)
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const result = await response.json();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// ✅ Page Component (Server Component)
export default async function Page({ params }) {
  const slug = params.Slug; // ✅ Get dynamic slug from URL
  const data = await fetchData(slug); // ✅ Fetch data on the server

  if (!data) {
    return <p className="text-center text-xl text-red-500 mt-20">No data found.</p>;
  }

  return <Petal data={data} />;
}
