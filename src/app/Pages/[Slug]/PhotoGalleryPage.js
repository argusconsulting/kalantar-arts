"use client";
import { useRef, useState } from "react";
import { Facebook, Instagram, Youtube, Phone, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export default function PhotoGalleryPage({ data }) {
  const scrollRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Extract CMS Images if they exist
  const cmsImages = data?.[0]?.image ? data[0].image.split(',') : [];
  const currentUrls = data?.[0]?.image_urls ? data[0].image_urls.split(',') : [];

  const hardcodedHighlights = [
    { caption: "Winter Showcase 2023", sub: "EXHIBITIONS", img: "/images/gallery/highlight-1.jpg" },
    { caption: "Art for All Generations", sub: "COMMUNITY OUTREACH", img: "/images/gallery/highlight-2.jpg" },
    { caption: "The Ceramics Lab", sub: "WORKSHOP", img: "/images/gallery/highlight-3.jpg" },
    { caption: "The Closing Ceremony", sub: "EVENT", img: "/images/gallery/highlight-4.jpg" },
  ];

  // If CMS has images, use them for highlights. Otherwise fallback.
  const highlights = cmsImages.length > 0
    ? cmsImages.map((imgName, idx) => ({
        caption: `Gallery Image ${idx + 1}`,
        sub: "KALANTAR ARTS",
        img: `${process.env.NEXT_PUBLIC_Files_URL}/${imgName}`
      }))
    : hardcodedHighlights;

  const hardcodedGalleryItems = [
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-1.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-2.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-3.jpg" },
    { caption: "Urban Heritage Hand", sub: "Photo Art Project", img: "/images/gallery/photo-4.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-5.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-6.jpg" },
    { caption: "Young Talent Spotlight", sub: "Art Development", img: "/images/gallery/photo-7.jpg" },
  ];

  // If CMS has images, format them to match the gallery structure. Otherwise, fallback to hardcoded.
  const galleryItems = cmsImages.length > 0
    ? cmsImages.map((imgName, idx) => {
        const specificUrl = currentUrls[idx] && currentUrls[idx] !== "null" && currentUrls[idx] !== ""
          ? (currentUrls[idx].startsWith("http") ? currentUrls[idx] : `https://${currentUrls[idx]}`)
          : null;
        return {
          caption: data[0]?.name || "Kalantar Highlights",
          sub: "Photo Gallery",
          img: `${process.env.NEXT_PUBLIC_Files_URL}/${imgName}`,
          url: specificUrl
        };
      })
    : hardcodedGalleryItems;

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
      <section className="bg-[#fceef3] py-16">
        <div className="px-8 md:px-16 flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#3a1020] mb-2">
              Highlights from Kalantar
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
              className="relative flex-shrink-0 w-[80vw] sm:w-[45vw] lg:w-[26vw] xl:w-[24vw] h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-[#a91846]/10"
            >
              <img
                src={h.img}
                alt={h.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a0b17]/90 via-[#2a0b17]/30 to-transparent flex flex-col justify-end p-5">
                {h.sub && (
                  <p className="text-[10px] uppercase tracking-widest text-orange-200 font-bold mb-1">
                    {h.sub}
                  </p>
                )}
                <p className="text-white text-lg font-bold font-serif leading-tight">
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
            <div key={i} className="group">
              <div 
                className={`rounded-md overflow-hidden aspect-square mb-2 relative ${item.url ? '' : 'cursor-pointer'}`}
                onClick={() => !item.url && setSelectedImage(item.img)}
              >
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                    <img
                      src={item.img}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white/90 text-pink-700 px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        Visit Link
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="block w-full h-full relative">
                    <img
                      src={item.img}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                       <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 w-10 h-10 drop-shadow-lg" />
                    </div>
                  </div>
                )}
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

      {/* Lightbox / Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black bg-opacity-95 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-10 md:right-10 text-white/70 hover:text-white text-5xl transition-colors font-light"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Gallery zoom"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </main>
  );
}