import { Facebook, Instagram, Youtube, Phone, User, Users } from "lucide-react";

export default function ExecutiveTeamPage({ data }) {
  const cmsImages = data?.[0]?.image ? data[0].image.split(',') : [];

  const parseTeam = (htmlString) => {
    if (!htmlString) return [];
    
    // First try to extract list items, if empty try paragraphs
    let regex = /<li[^>]*>(.*?)<\/li>/gi;
    let matches = [...htmlString.matchAll(regex)];
    if (matches.length === 0) {
      regex = /<p[^>]*>(.*?)<\/p>/gi;
      matches = [...htmlString.matchAll(regex)];
    }
    
    const extracted = [];
    for (const match of matches) {
      const rawContent = match[1];
      
      // Check if user inserted an image directly inside the text
      const imgRegex = /<img[^>]+src="([^">]+)"/i;
      const imgMatch = rawContent.match(imgRegex);
      const inlineImg = imgMatch ? imgMatch[1] : null;

      const cleanText = rawContent
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim();
        
      if (!cleanText) continue;

      // Look for a colon or dash to split Name and Description if provided
      const parts = cleanText.split(/[:\-]/);
      const name = parts[0].trim();
      const desc = parts.length > 1 
        ? parts.slice(1).join('-').trim() 
        : "Executive member dedicated to our core mission.";
        
      if (name) extracted.push({ name, desc, inlineImg });
    }
    return extracted;
  };

  const extraData = data?.[0]?.extra_data ? JSON.parse(data[0].extra_data) : {};
  let cmsTeam = extraData?.teamMembers || [];

  if (cmsTeam.length === 0) {
    cmsTeam = parseTeam(data?.[0]?.Richtext);
  }

  const hardcodedTeam = [
    {
      name: "Vishal Srivastava",
      desc: "Founder & Chairman - Visionary leader driving the mission of Kalantar.",
    },
    {
      name: "Puja Srivastava",
      desc: "Co-Founder & Director - Passionate about art education and social change.",
    },
    {
      name: "Smt. Navodita Mishra",
      desc: "Programme Executive - Dedicated to expanding our community outreach.",
    }
  ];

  const team = cmsTeam.length > 0 ? cmsTeam : hardcodedTeam;

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
          Our Leadership
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#3a1020] mb-4">
          {data?.[0]?.name || "Executive Team"}
        </h1>
        <p className="text-sm md:text-base text-[#5a3a45] max-w-2xl mx-auto">
          Meet the passionate individuals driving the vision of Kalantar Art Foundation. Our team is dedicated to fostering creativity, culture, and positive social change.
        </p>
      </section>

      {/* ===== TEAM GRID ===== */}
      <section className="px-8 md:px-16 py-16">
        <h2 className="text-2xl font-bold text-center text-[#3a1020] mb-12 flex items-center justify-center gap-3">
          <Users className="text-[#a91846]" />
          The People Behind the Mission
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col items-center p-8 border border-gray-100 group"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-pink-50 shadow-md group-hover:scale-105 transition-transform duration-500">
                {member.inlineImg || cmsImages[i] ? (
                  <img
                    src={member.inlineImg ? member.inlineImg : `${process.env.NEXT_PUBLIC_Files_URL}/${cmsImages[i]}`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User size={48} className="text-gray-300" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-xl text-[#3a1020] mb-1 text-center">
                {member.name}
              </h3>
              <div className="w-10 h-1 bg-[#a91846] rounded-full mb-4"></div>
              <p className="text-sm text-gray-500 leading-relaxed text-center">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="px-8 pb-16">
        <div className="bg-gradient-to-r from-[#a91846] to-[#7a1430] rounded-2xl text-center text-white px-8 py-12 max-w-5xl mx-auto shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Want to Join Our Team?
          </h2>
          <p className="text-sm max-w-xl mx-auto mb-6 text-pink-100">
            We are always looking for passionate individuals who want to make a difference in the world of art and culture.
          </p>
          <button className="bg-white text-[#a91846] text-sm font-bold px-8 py-4 rounded-full shadow-lg hover:bg-pink-50 transition tracking-wide hover:scale-105 active:scale-95">
            GET INVOLVED
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
    </main>
  );
}
