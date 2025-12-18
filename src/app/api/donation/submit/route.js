import { NextResponse } from 'next/server';
import { validateOrigin } from '@/utils/security';

export async function POST(request) {
    if (!validateOrigin(request)) {
        return NextResponse.json({ error: "Forbidden Access" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const {
            name,
            pan_number,
            address,
            contact_number,
            email,
            donation_amount,
            payment_method,
            transaction_id,
            status
        } = body;

        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/donation_submissions`;

        if (!process.env.NEXT_PUBLIC_API_URL) {
            return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 });
        }

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.JWT_SECRET}`,
            },
            body: JSON.stringify({
                name,
                pan_number,
                address,
                contact_number,
                email,
                donation_amount,
                payment_method,
                transaction_id,
                status
            })
        });

        // The original code just checked response.ok
        let data = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        }

        if (!response.ok) {
            return NextResponse.json({ success: false, error: "Backend Error" }, { status: response.status });
        }

        return NextResponse.json({ success: true, ...data });

    } catch (error) {
        console.error("Error submitting donation:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
