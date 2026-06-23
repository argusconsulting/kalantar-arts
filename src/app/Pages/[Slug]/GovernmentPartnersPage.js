import { Facebook, Instagram, Youtube, Phone } from "lucide-react";

export default function GovernmentPartnersPage() {
  const partners = [
    {
      name: "Ministry of Culture",
      desc: "Supporting cultural preservation and art promotion across the nation.",
    },
    {
      name: "ICCR",
      desc: "Promoting cultural exchange and global artistic relations on behalf of India.",
    },
    {
      name: "NGO Darpan",
      desc: "Ensuring transparency and institutional compliance through NITI Aayog guidelines.",
    },
    {
      name: "Govt. of Uttar Pradesh",
      desc: "Collaborating on regional heritage preservation and major art festivals.",
    },
  ];

  return (
    <main className="bg-white text-[#2b2b2b]">
      {/* ===== TOP UTILITY BAR ===== */}
      <div className="hidden md:flex items-center justify-between px-8 py-2 text-xs text-white bg-[#7a1430]">
        <span className="flex items-center gap-2">
          <Phone size={14} /> Reach Out to Us: (0120) 1234568
        </span>
        <div className="flex items-center gap-3">
          <Facebook size={14} />
          <Instagram size={14} />
          <Youtube size={14} />
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src="/images/kalantar-logo.png" alt="Kalantar" className="h-10 w-auto" />
          <div className="leading-tight">
            <p className="font-semibold text-[#7a1430] text-lg">कलांतर</p>
            <p className="text-[10px] tracking-wide text-gray-500">ART FOUNDATION</p>
          </div>
        </div>
        <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#3a3a3a]">
          <li className="hover:text-[#a91846] cursor-pointer">Know Us</li>
          <li className="hover:text-[#a91846] cursor-pointer">Our Activities</li>
          <li className="hover:text-[#a91846] cursor-pointer">Clicks &amp; Shoots</li>
          <li className="hover:text-[#a91846] cursor-pointer">Help Us</li>
          <li className="hover:text-[#a91846] cursor-pointer">Get Involved</li>
          <li className="hover:text-[#a91846] cursor-pointer">Contact Us</li>
        </ul>
      </nav>

      {/* ===== HERO / INTRO ===== */}
      <section className="bg-gradient-to-b from-[#f6dde2] to-white text-center px-8 py-16">
        <p className="uppercase text-xs font-semibold tracking-widest text-[#a91846] mb-3">
          Community &amp; Collaboration
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#3a1020] mb-4">
          Government Partners
        </h1>
        <p className="text-sm md:text-base text-[#5a3a45] max-w-2xl mx-auto">
          Collaborating with Government Institutions to Promote Art,
          Culture, Education, Social Awareness, and Community Development
          Across India.
        </p>
      </section>

      {/* ===== ORGANIZATIONS GRID ===== */}
      <section className="px-8 md:px-16 py-16">
        <h2 className="text-2xl font-bold text-center text-[#3a1020] mb-12">
          Organizations Supporting the Mission
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((p, i) => (
            <div
              key={i}
              className="bg-[#fbeef1] rounded-md p-6 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-md bg-white flex items-center justify-center mb-4 shadow-sm">
                {/* Replace with actual partner logo asset */}
                <img
                  src={`/images/partners/${p.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}.png`}
                  alt={p.name}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h3 className="font-semibold text-sm text-[#3a1020] mb-2">
                {p.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="px-8 pb-16">
        <div className="bg-gradient-to-r from-[#a91846] to-[#7a1430] rounded-md text-center text-white px-8 py-12 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Join Hands For A Creative Future
          </h2>
          <p className="text-sm max-w-xl mx-auto mb-6 text-pink-100">
            Explore how our joint efforts are reshaping the landscape of
            Indian art and culture.
          </p>
          <button className="bg-white text-[#a91846] text-sm font-semibold px-6 py-3 rounded-md hover:bg-pink-50 transition tracking-wide">
            EXPLORE OUR INITIATIVES
          </button>
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
              <li>Home</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3">Related Sites</p>
            <ul className="text-xs text-gray-500 space-y-2">
              <li>NHDC</li>
              <li>GDIA</li>
              <li>Vishal Srivastava</li>
              <li>Pop Structure</li>
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