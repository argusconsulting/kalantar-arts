import { NextResponse } from 'next/server';
import { validateOrigin } from '@/utils/security';

export async function POST(request) {
    if (!validateOrigin(request)) {
        return NextResponse.json({ error: "Forbidden Access" }, { status: 403 });
    }



    try {
        const body = await request.json();
        const { name, email, phone, city, ticket_price, number_of_tickets, category, payment_id } = body;

        console.log("Received booking request:", body);
        const backendUrl = process.env.NEXT_PUBLIC_Booking_API_URL;

        if (!backendUrl) {
            return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 });
        }

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                city,
                ticket_price,
                number_of_tickets,
                category,
                payment_id
            })
        });


        console.log("Booking response status:", response);
        // Note: The original client code handles response.ok but expects empty body or json? 
        // The original code was: const res = await fetch(...)
        // if (res.ok) ...
        // It didn't explicitly parse JSON for success case in bookTicket, but let's check.
        // Actually, looking at the code: `if (res.ok) { ... } else { throw new Error(...) }`
        // It doesn't use the body on success, but it might return one.
        // Let's retry safely.

        let data = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        }

        if (!response.ok) {
            return NextResponse.json({ error: "Booking failed" }, { status: response.status });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("Error booking ticket:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
