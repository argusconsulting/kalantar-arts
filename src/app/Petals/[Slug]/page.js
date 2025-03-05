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

// ✅ Metadata Function
export async function generateMetadata({ params }) {
  const slug = params.Slug;
  const data = await fetchData(slug);

  if (!data) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  return {
  
    title: data.title || "Petal Page",
    description: data.description || "Detailed information about the selected petal.",
    openGraph: {
      
      title: data.title || "Petal Page",
      description: data.description || "Detailed information about the selected petal.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/petal/${slug}`,
      images: data.hero_img
      ? [{ url: `${process.env.NEXT_PUBLIC_Files_URL}/${data.hero_img}`, width: 1000, height: 1000, alt: data.title }]
      : [],
    },
  };
}

// ✅ Page Component (Server Component)
export default async function Page({ params }) {
  const slug = params.Slug; // ✅ Get dynamic slug from URL
  const data = await fetchData(slug); // ✅ Fetch data on the server

  if (!data) {
    return <p className="text-center text-xl text-red-500 mt-20">No data found.</p>;
  }

  return <Petal data={data} />;
}
