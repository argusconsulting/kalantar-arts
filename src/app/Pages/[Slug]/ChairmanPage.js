import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Paintbrush,
  Landmark,
  Users,
  Sparkles,
} from "lucide-react";

export default function ChairmanPage() {
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
          {/* Replace with actual logo asset */}
          <img src="/images/kalantar-logo.png" alt="Kalantar" className="h-10 w-auto" />
          <div className="leading-tight">
            <p className="font-semibold text-[#7a1430] text-lg">कलांतर</p>
            <p className="text-[10px] tracking-wide text-gray-500">ART FOUNDATION</p>
          </div>
        </div>
        <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#3a3a3a]">
          <li className="hover:text-[#a91846] cursor-pointer">Know Us</li>
          <li className="hover:text-[#a91846] cursor-pointer">Our Activities</li>
          <li className="hover:text-[#a91846] cursor-pointer">Clicks &amp; Stories</li>
          <li className="hover:text-[#a91846] cursor-pointer">Help Us</li>
          <li className="hover:text-[#a91846] cursor-pointer">Get Involved</li>
          <li className="hover:text-[#a91846] cursor-pointer">Contact Us</li>
        </ul>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#f6cfd9] via-[#d5497a] to-[#7a1430]">
        <div className="grid md:grid-cols-2 items-center gap-8 px-8 md:px-16 py-16 relative z-10">
          <div>
            <p className="uppercase text-xs font-semibold tracking-widest text-[#7a1430] mb-3">
              Leadership&rsquo;s Vision
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#3a1020] mb-4 leading-tight">
              Message from the Chairman
            </h1>
            <p className="text-sm md:text-base text-[#4a2030] max-w-md mb-6">
              Art has the power to inspire, connect communities, and create
              lasting impact. We believe in the transformative energy of
              creativity to bridge social divides.
            </p>
            <button className="bg-[#7a1430] text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-[#5e0f24] transition">
              Discover Our Vision ↓
            </button>
          </div>

          <div className="flex justify-center md:justify-end">
            {/* Replace src with actual chairman photo asset */}
            <img
              src="/images/chairman-hero.jpg"
              alt="Vishal Srivastava, Chairman"
              className="w-72 h-80 object-cover rounded-md shadow-xl"
            />
          </div>
        </div>

        {/* bottom wave */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C360,90 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#ffffff"
          />
        </svg>
      </section>

      {/* ===== QUOTE SECTION ===== */}
      <section className="px-8 md:px-24 py-16 text-center">
        <span className="text-5xl text-[#7a1430] font-serif leading-none">&rdquo;</span>
        <p className="text-[#3a1020] text-base md:text-lg leading-relaxed max-w-3xl mx-auto mt-2">
          एक सुसज्जित कला बिना किसी वाद विवाद के हमारे हृदय पर दीर्घकालिक
          प्रभाव छोड़ती है और बड़ी से बड़ी बात आसानी से समझा देती है। वहीं
          शब्दों से कुछ समझाने के प्रयास में सुलझे रिश्ते भी उलझ जाते हैं।
          बिना किसी दूसरे की सुने अपनी कह देना और हृदय पर अमिट प्रभाव छोड़
          देना ही कला का जादू है।
        </p>
        <p className="mt-6 text-xs tracking-widest font-semibold text-gray-500">
          VISHAL SRIVASTAVA,
          <br />
          CHAIRMAN &ndash; KALANTAR ART FOUNDATION
        </p>
      </section>

      {/* ===== PROFILE SECTION ===== */}
      <section className="px-8 md:px-24 py-12 grid md:grid-cols-2 gap-12 items-start">
        <div className="relative w-full max-w-sm">
          {/* Replace src with actual chairman photo asset */}
          <img
            src="/images/chairman-profile.jpg"
            alt="Vishal Srivastava"
            className="w-full h-96 object-cover rounded-md"
          />
          <div className="absolute bottom-4 right-[-1rem] bg-[#a91846] text-white rounded-md px-4 py-3 shadow-lg text-center">
            <p className="text-2xl font-bold leading-none">15+</p>
            <p className="text-[10px] leading-tight mt-1">
              Years of
              <br />
              Visionary Leadership
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#7a1430] mb-3">
            Vishal Srivastava
          </h2>
          <p className="text-sm text-gray-600 mb-8 max-w-md">
            As an advocate for the democratization of art, Vishal has
            dedicated over a decade to building a platform where talent meets
            opportunity, regardless of background or geography.
          </p>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            <Feature
              icon={<Paintbrush size={20} />}
              title="Art Foundation"
              desc="Spotlighting emerging artists on global stages."
            />
            <Feature
              icon={<Landmark size={20} />}
              title="Cultural Preservation"
              desc="Safeguarding heritage through digital archives."
            />
            <Feature
              icon={<Users size={20} />}
              title="Community Impact"
              desc="Art workshops for underserved communities."
            />
            <Feature
              icon={<Sparkles size={20} />}
              title="Creative Empowerment"
              desc="Economic upliftment in traditional art forms."
            />
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="text-center px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3a1020] mb-3">
          Be Part of the Journey
        </h2>
        <p className="text-sm text-gray-600 max-w-xl mx-auto mb-6">
          Join our mission to empower artists and preserve the rich tapestry
          of our cultural heritage for future generations.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-[#7a1430] text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-[#5e0f24] transition">
            Become Member
          </button>
          <button className="border border-[#7a1430] text-[#7a1430] text-sm font-semibold px-6 py-3 rounded-md hover:bg-[#7a1430] hover:text-white transition">
            Connect With Us
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
              To bring a phenomenal impact on the world of art for the
              betterment of mankind.
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

function Feature({ icon, title, desc }) {
  return (
    <div>
      <div className="text-[#a91846] mb-2">{icon}</div>
      <p className="font-semibold text-sm text-[#2b2b2b] mb-1">{title}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
