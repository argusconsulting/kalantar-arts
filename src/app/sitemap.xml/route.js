import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://kalantarart.org";

  const staticPages = [
    "/", // Home
    "/Pages/Vision-Mission",
    "/People-with-us/The-Founders",
    "/People-with-us/The-Advisors",
    "/Pages/Social-Partners",
    "/Pages/Government-Partners",
    "/Pages/Corporate-Partners",
    "/Contact-Us",
    "/Petals/Kala-Deeksha",
    "/Petals/Karagaar-Ke-Kalaakar",
    "/Petals/Art-Villages",
    "/Petals/Colors-of-the-Corporate",
    "/Petals/Annual-Art-Festival",
    "/Petals/64-Traits-of-Art",
  ];

  const urls = staticPages.map((page, index) => {
    return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${index === 0 ? "1.0" : "0.8"}</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
