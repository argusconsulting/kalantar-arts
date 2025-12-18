import { NextResponse } from 'next/server';
import { validateOrigin } from '@/utils/security';

export async function POST(request) {
    if (!validateOrigin(request)) {
        return NextResponse.json({ error: "Forbidden Access" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { amount, currency, payment_type, username, email, mobile, pan } = body;

        const backendUrl = process.env.NEXT_PUBLIC_RAZORPAY_order_URI;

        if (!backendUrl) {
            return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 });
        }

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.JWT_SECRET}`
            },
            body: JSON.stringify({ amount, currency, payment_type, username, email, mobile, pan })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
