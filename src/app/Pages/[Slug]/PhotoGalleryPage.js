"use client";
import { useRef } from "react";
import { Facebook, Instagram, Youtube, Phone, ChevronLeft, ChevronRight } from "lucide-react";

export default function PhotoGalleryPage() {
  const scrollRef = useRef(null);

  const highlights = [
    { caption: "Winter Showcase 2023", img: "/images/gallery/highlight-1.jpg" },
    { caption: "Art for All Generations", img: "/images/gallery/highlight-2.jpg" },
    { caption: "The Ceramics Lab", img: "/images/gallery/highlight-3.jpg" },
    { caption: "The Closing Ceremony", img: "/images/gallery/highlight-4.jpg" },
  ];

  const galleryItems = [
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-1.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-2.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-3.jpg" },
    { caption: "Urban Heritage Hand", sub: "Photo Art Project", img: "/images/gallery/photo-4.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-5.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-6.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-7.jpg" },
  ];

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
          Photo Gallery
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Capturing the Soul of Art and Culture through the lens of heritage
          and modern creativity.
        </p>
      </section>

      {/* ===== HIGHLIGHTS CAROUSEL ===== */}
      <section className="bg-[#f6dde2] py-10">
        <div className="px-8 md:px-16 flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#3a1020]">
            Highlights from Kalantar
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-8 md:px-16 scroll-smooth pb-2"
        >
          {highlights.map((h, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-60 h-72 rounded-md overflow-hidden"
            >
              <img
                src={h.img}
                alt={h.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm font-semibold">
                  {h.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PHOTO GALLERY GRID ===== */}
      <section className="px-8 md:px-16 py-16">
        <p className="text-center uppercase text-xs font-semibold tracking-widest text-[#a91846] mb-10">
          Photo Gallery
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {galleryItems.map((item, i) => (
            <div key={i}>
              <div className="rounded-md overflow-hidden aspect-square mb-2">
                <img
                  src={item.img}
                  alt={item.caption}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-semibold text-[#3a1020]">
                {item.caption}
              </p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
          ))}
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