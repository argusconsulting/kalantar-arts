import ActivitiesPage from "./ActivitiesPage";

// ✅ Server-side Data Fetching
const fetchData = async (slug) => {
  try {
    // Fetching from SubMenuLinks which holds the CRM data for menu pages like "Free art Education"
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks/?link=${slug}`, {
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
  const { Slug } = await params;
  const slug = Slug;
  const data = await fetchData(slug);

  if (!data) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  return {
    title: data.title || "Activity Page",
    description: data.description || "Detailed information about the selected activity.",
    openGraph: {
      title: data.title || "Activity Page",
      description: data.description || "Detailed information about the selected activity.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/Activities/${slug}`,
      images: data.hero_img
      ? [{ url: `${process.env.NEXT_PUBLIC_Files_URL}/${data.hero_img}`, width: 1000, height: 1000, alt: data.title }]
      : [],
    },
  };
}

// ✅ Page Component (Server Component)
export default async function Page({ params }) {
  const { Slug } = await params;
  const slug = Slug; // ✅ Get dynamic slug from URL
  const data = await fetchData(slug); // ✅ Fetch data on the server

  if (!data) {
    return <p className="text-center text-xl text-red-500 mt-20">No data found.</p>;
  }

  return <ActivitiesPage data={data} />;
}
