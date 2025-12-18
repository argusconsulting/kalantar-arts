import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        const backendUrl = process.env.NEXT_PUBLIC_RAZORPAY_verify_URI;

        if (!backendUrl) {
            return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 });
        }

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.JWT_SECRET}`
            },
            body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
