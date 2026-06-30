import { Facebook, Instagram, Youtube, Phone, Landmark } from "lucide-react";

export default function SocialPartnersPage({ data }) {
  const cmsImages = data?.[0]?.image ? data[0].image.split(',') : [];

  const parsePartners = (htmlString) => {
    if (!htmlString) return [];
    const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
    const extracted = [];
    let match;
    while ((match = liRegex.exec(htmlString)) !== null) {
      const rawContent = match[1];

      // Check if user inserted an image directly inside the bullet point
      const imgRegex = /<img[^>]+src="([^">]+)"/i;
      const imgMatch = rawContent.match(imgRegex);
      const inlineImg = imgMatch ? imgMatch[1] : null;

      const cleanText = rawContent
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim();

      // Look for a colon or dash to split Name and Description if provided
      const parts = cleanText.split(/[:\-]/);
      const name = parts[0].trim();
      const desc = parts.length > 1
        ? parts.slice(1).join('-').trim()
        : "Proudly supporting Kalantar Art Foundation in its mission to empower communities and create lasting social impact.";

      if (name) extracted.push({ name, desc, inlineImg });
    }
    return extracted;
  };

  const cmsPartners = parsePartners(data?.[0]?.Richtext);

  const hardcodedPartners = [
    {
      name: "Sai Hari Narayan Seva Samathan, Mumbai",
      desc: "Sai Hari Narayan Seva Samathan is committed to empowering communities through education, healthcare, and social welfare initiatives. Their dedication to humanitarian service aligns with Kalantar Art Foundation's mission of creating positive and lasting social impact. Together, we work towards building stronger and more inclusive communities.",
    },
    {
      name: "Sai Hari Narayan Seva Samathan, Mumbai",
      desc: "Sai Hari Narayan Seva Samathan is committed to empowering communities through education, healthcare, and social welfare initiatives. Their dedication to humanitarian service aligns with Kalantar Art Foundation's mission of creating positive and lasting social impact. Together, we work towards building stronger and more inclusive communities.",
    },
    {
      name: "Sai Hari Narayan Seva Samathan, Mumbai",
      desc: "Sai Hari Narayan Seva Samathan is committed to empowering communities through education, healthcare, and social welfare initiatives. Their dedication to humanitarian service aligns with Kalantar Art Foundation's mission of creating positive and lasting social impact. Together, we work towards building stronger and more inclusive communities.",
    },
  ];

  const partners = cmsPartners.length > 0 ? cmsPartners : hardcodedPartners;

  return (
    <main className="bg-white text-[#2b2b2b]">


      {/* ===== HERO / INTRO ===== */}
      <section className="bg-[#f6dde2] text-center px-8 py-16">
        <p className="uppercase text-xs font-semibold tracking-widest text-[#a91846] mb-3">
          Community &amp; Collaboration
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#3a1020] mb-4">
          {data?.[0]?.name || "Our Social Partners"}
        </h1>
        <p className="text-sm md:text-base text-[#5a3a45] max-w-2xl mx-auto">
          We believe that art is a catalyst for profound societal
          transformation. By aligning with voluntary organizations,
          governmental bodies, and corporate leaders, we bridge the gap
          between creative heritage and sustainable community development.
        </p>
      </section>

      {/* ===== ORGANIZATIONS GRID ===== */}
      <section className="px-8 md:px-16 py-16">
        <h2 className="text-2xl font-bold text-center text-[#3a1020] mb-12">
          Organizations Supporting the Mission
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {partners.map((p, i) => (
            <div key={i}>
              <div className="w-16 h-16 rounded-md bg-white flex items-center justify-center mb-4 shadow-sm p-2 overflow-hidden">
                {p.inlineImg || cmsImages[i] ? (
                  <img
                    src={p.inlineImg ? p.inlineImg : `${process.env.NEXT_PUBLIC_Files_URL}/${cmsImages[i]}`}
                    alt={p.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Landmark size={28} className="text-[#a91846]" />
                )}
              </div>
              <h3 className="text-[#a91846] font-semibold text-sm mb-3">
                {p.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                {p.desc}
              </p>
              <a
                href="#"
                className="text-xs font-semibold text-[#7a1430] hover:underline"
              >
                Learn More &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ===== QUOTE SECTION ===== */}
      <section className="bg-[#f6dde2] px-8 md:px-24 py-16 text-center">
        <span className="text-5xl text-[#a91846] font-serif leading-none">
          &rdquo;
        </span>
        <p className="text-[#3a1020] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-2 font-medium">
          &ldquo;Art becomes truly transformative when communities,
          institutions, and organizations come together with a shared
          purpose.&rdquo;
        </p>
        <p className="mt-6 text-xs tracking-widest font-semibold text-gray-500">
          &mdash; KALANTAR ART FOUNDATION
        </p>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="px-8 py-16">
        <div className="bg-[#a91846] rounded-md text-center text-white px-8 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Become a Social Partner
          </h2>
          <p className="text-sm max-w-xl mx-auto mb-6 text-pink-100">
            Join our network of like-minded organizations and impact-driven
            leaders. Together, we can rewrite the future of heritage.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-[#a91846] text-sm font-semibold px-6 py-3 rounded-md hover:bg-pink-50 transition">
              Become a Partner
            </button>
            <button className="border border-white text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-[#a91846] transition">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#fafafa] border-t border-gray-100 px-8 md:px-16 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/kalantar-logo.png" alt="Kalantar" className="h-8 w-auto" />
              <p className="font-semibold text-[#7a1430]">कलांतर</p>
            </div>
            <p className="text-xs text-gray-500 max-w-xs">
              To bring a phenomenal impact on the society by way of
              practicing all the 64 sects of art for betterment of mankind.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3">Quick Links</p>
            <ul className="text-xs text-gray-500 space-y-2">
              <li>Know Us</li>
              <li>Our Activities</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3">Related Sites</p>
            <ul className="text-xs text-gray-500 space-y-2">
              <li>Partner Organizations</li>
              <li>Press &amp; Media</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Facebook size={16} />
          <Instagram size={16} />
          <Youtube size={16} />
        </div>
      </footer>
    </main>
  );
}
