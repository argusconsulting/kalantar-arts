import ArtFestivalClient from "./ArtFestivalClient";



// 1. Define SEO Metadata based on the provided text
export const metadata = {
  title: "Kalantar 2025 | Annual Art Festival & National Competition",
  description:
    "Join Kalantar 2025 at India International Centre on Dec 26, 2025. Supported by the Ministry of Education, Ministry of Culture, UGC, and AICTE. An initiative for emotional resilience through art.",
  keywords: [
    "Kalantar 2025",
    "Art Festival India",
    "Kalantar Art Foundation",
    "National Art Competition",
    "India International Centre Events",
    "Art for Mental Health",
  ],
  openGraph: {
    title: "Kalantar 2025 | Annual Art Festival",
    description:
      "Supported by the Ministry of Education & Culture. Join us on Dec 26, 2025, at IIC for a unique initiative impacting thousands of lives through art.",
    type: "website",
    locale: "en_IN",
    siteName: "Kalantar Art Foundation",
  },
};


async function getAvailableTickets() {
  try {
    const res = await fetch('https://artfestivals.kalantarart.org/api/available-tickets', {
      cache: 'no-store' // SSR: Fetch fresh data on every request
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const response = await res.json();

    // Updated parsing logic based on your JSON structure
    if (response.success && response.data && response.data.inventory_summary) {
      return response.data.inventory_summary.available_tickets;
    }
    
    return 0; // Fallback if structure doesn't match
  } catch (error) {
    // console.error("Error fetching tickets:", error);
    return 0; // Default to 0 to prevent overselling on error
  }
}

export default async function Page() {
  const availableTickets = await getAvailableTickets();

  return (
    <ArtFestivalClient initialAvailableTickets={availableTickets} />
  );
}