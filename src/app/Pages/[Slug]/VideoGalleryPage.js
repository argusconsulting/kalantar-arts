"use client";
import { useRef, useState } from "react";
import { Facebook, Instagram, Youtube, Phone, ChevronLeft, ChevronRight, Play } from "lucide-react";

export default function VideoGalleryPage({ data }) {
  const scrollRef = useRef(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // Extract YouTube URLs if they exist
  const ytUrls = data?.[0]?.youtube_urls ? data[0].youtube_urls.split(',') : [];

  const extractYouTubeId = (urlStr) => {
    if (!urlStr) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const hardcodedHighlights = [
    { caption: "Winter Showcase 2023", sub: "EXHIBITIONS", id: "t0wO9FhR37o" },
    { caption: "Art for All Generations", sub: "COMMUNITY OUTREACH", id: "dQw4w9WgXcQ" },
    { caption: "The Ceramics Lab", sub: "WORKSHOP", id: "jNQXAC9IVRw" },
    { caption: "The Closing Ceremony", sub: "EVENT", id: "cVDjE5X1vL8" },
  ];

  // If CMS has videos, use them for highlights. Otherwise fallback.
  const highlights = ytUrls.length > 0
    ? ytUrls.map((url, idx) => ({
      caption: `Video Highlight ${idx + 1}`,
      sub: "KALANTAR ARTS",
      id: extractYouTubeId(url)
    })).filter(h => h.id)
    : hardcodedHighlights;

  // If CMS has videos, format them to match the gallery structure. Otherwise, fallback.
  const galleryItems = ytUrls.length > 0
    ? ytUrls.map((url) => ({
      caption: data[0]?.name || "Kalantar Videos",
      sub: "Video Gallery",
      id: extractYouTubeId(url)
    })).filter(h => h.id)
    : hardcodedHighlights;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

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
      <section className="text-center px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#a91846] mb-3">
          Video Gallery
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Experience the Soul of Art and Culture in motion, capturing heritage
          and modern creativity.
        </p>
      </section>

      {/* ===== HIGHLIGHTS CAROUSEL ===== */}
      <section className="bg-[#fceef3] py-16">
        <div className="px-8 md:px-16 flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#3a1020] mb-2">
              Video Highlights from Kalantar
            </h2>
            <div className="w-16 h-1 bg-[#a91846]"></div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-md border border-[#a91846]/30 bg-transparent flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} className="text-[#3a1020]" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-md border border-[#a91846]/30 bg-transparent flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight size={18} className="text-[#3a1020]" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-8 md:px-16 scroll-smooth pb-4 scrollbar-hide"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {highlights.map((h, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[85vw] sm:w-[60vw] lg:w-[40vw] xl:w-[35vw] aspect-video rounded-2xl overflow-hidden shadow-lg border border-[#a91846]/10 cursor-pointer group"
              onClick={() => setSelectedVideoId(h.id)}
            >
              <img
                src={`https://img.youtube.com/vi/${h.id}/maxresdefault.jpg`}
                alt={h.caption}
                onError={(e) => { e.target.src = `https://img.youtube.com/vi/${h.id}/hqdefault.jpg`; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a0b17]/90 via-[#2a0b17]/30 to-transparent flex flex-col justify-end p-5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play fill="white" className="text-white opacity-80 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 w-16 h-16 drop-shadow-xl" />
                </div>
                {h.sub && (
                  <p className="text-[10px] uppercase tracking-widest text-orange-200 font-bold mb-1 relative z-10">
                    {h.sub}
                  </p>
                )}
                <p className="text-white text-lg font-bold font-serif leading-tight relative z-10">
                  {h.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VIDEO GALLERY GRID ===== */}
      <section className="px-8 md:px-16 py-16">
        <p className="text-center uppercase text-xs font-semibold tracking-widest text-[#a91846] mb-10">
          Video Gallery
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => setSelectedVideoId(item.id)}>
              <div className="rounded-md overflow-hidden aspect-video mb-3 relative bg-black">
                <img
                  src={`https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`}
                  alt={item.caption}
                  onError={(e) => { e.target.src = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`; }}
                  className="w-full h-full object-cover group-hover:scale-105 opacity-80 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play fill="white" className="text-white opacity-90 transform scale-75 group-hover:scale-100 transition-all duration-300 w-14 h-14 drop-shadow-lg" />
                </div>
              </div>
              <p className="text-sm font-semibold text-[#3a1020]">
                {item.caption}
              </p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>



      {/* Lightbox / Video Modal */}
      {selectedVideoId && (
        <div
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black bg-opacity-95 p-4 backdrop-blur-sm"
          onClick={() => setSelectedVideoId(null)}
        >
          <div className="relative max-w-6xl w-full aspect-video flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideoId(null)}
              className="absolute -top-12 right-0 md:-top-10 md:-right-10 text-white/70 hover:text-white text-5xl transition-colors font-light"
            >
              &times;
            </button>
            <iframe
              className="w-full h-full rounded-xl shadow-2xl bg-black"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </main>
  );
}
