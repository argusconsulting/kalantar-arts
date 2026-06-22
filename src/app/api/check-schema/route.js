import { NextResponse } from 'next/server';

// This route runs the ALTER TABLE migration on the production DB
// via the backend API's generic CRUD mechanism using raw SQL.
// Call this once to add the new columns to SubMenuLinks.
export async function GET() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = process.env.JWT_SECRET;

    if (!apiUrl || !token) {
        return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
    }

    // We'll do a test read to check which columns already exist
    // by reading one SubMenuLinks record and inspecting the keys
    try {
        const readRes = await fetch(`${apiUrl}/SubMenuLinks`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!readRes.ok) {
            const txt = await readRes.text();
            return NextResponse.json({ error: `Read failed: ${txt}` }, { status: readRes.status });
        }

        const rows = await readRes.json();
        const existingKeys = rows && rows.length > 0 ? Object.keys(rows[0]) : [];

        return NextResponse.json({
            message: 'Column check complete',
            existingColumns: existingKeys,
            hasImage: existingKeys.includes('image'),
            hasImageUrls: existingKeys.includes('image_urls'),
            hasUrl: existingKeys.includes('url'),
            hasUrlLabel: existingKeys.includes('url_label'),
            hasYoutubeUrls: existingKeys.includes('youtube_urls'),
        });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
