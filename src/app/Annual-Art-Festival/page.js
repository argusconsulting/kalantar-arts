import ArtFestivalClient from "./ArtFestivalClient";

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