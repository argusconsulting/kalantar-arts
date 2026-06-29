"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Facebook, Instagram, Youtube, Phone, ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_INTERVAL_MS = 4000;

export default function PhotoGalleryPage({ data }) {
  const scrollRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Extract CMS Images if they exist
  const cmsImages = data?.[0]?.image ? data[0].image.split(',') : [];
  const currentUrls = data?.[0]?.image_urls ? data[0].image_urls.split(',') : [];
  const pageUrl = data?.[0]?.url;

  const hardcodedHighlights = [
  { caption: "Winter Showcase 2023", sub: "EXHIBITIONS", img: "/images/gallery/highlight-1.jpg" },
  { caption: "Art for All Generations", sub: "COMMUNITY OUTREACH", img: "/images/gallery/highlight-2.jpg" },
  { caption: "The Ceramics Lab", sub: "WORKSHOP", img: "/images/gallery/highlight-3.jpg" },
  { caption: "The Closing Ceremony", sub: "EVENT", img: "/images/gallery/highlight-4.jpg" },
];

const [isPaused, setIsPaused] = useState(false);
  // `data` is expected to be the array returned by GET /gallery
  // (the same shape the admin table manages): one object per slide with
  // { id, image, caption, link, link_label, aspectRatio, order }.
  const slides = Array.isArray(data)
    ? [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const hardcodedSlides = [
    { id: "h1", caption: "Winter Showcase 2023", link: null, link_label: null, img: "/images/gallery/highlight-1.jpg" },
    { id: "h2", caption: "Art for All Generations", link: null, link_label: null, img: "/images/gallery/highlight-2.jpg" },
    { id: "h3", caption: "The Ceramics Lab", link: null, link_label: null, img: "/images/gallery/highlight-3.jpg" },
    { id: "h4", caption: "The Closing Ceremony", link: null, link_label: null, img: "/images/gallery/highlight-4.jpg" },
  ];

  const resolvedSlides = slides.length > 0
    ? slides.map((item) => ({
        id: item.id,
        caption: item.caption || "",
        link: item.link && item.link !== "#" ? item.link : null,
        link_label: item.link_label || "Open Link",
        img: `${process.env.NEXT_PUBLIC_Files_URL}/${item.image}`,
      }))
    : hardcodedSlides;

  // Duplicate the list so the strip can loop seamlessly, both for
  // autoplay and for manual scroll-back-to-start.
  const loopedSlides = resolvedSlides.length > 0
    ? [...resolvedSlides, ...resolvedSlides]
    : [];

  const cardWidth = useCallback(() => {
    if (!scrollRef.current) return 280;
    const firstCard = scrollRef.current.querySelector("[data-slide-card]");
    if (!firstCard) return 280;
    const gap = 24; // matches gap-6
    return firstCard.getBoundingClientRect().width + gap;
  }, []);

  const scrollByDir = useCallback((dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * cardWidth(), behavior: "smooth" });
  }, [cardWidth]);

  // Manual arrow click: nudge the track and pause autoplay briefly so the
  // click doesn't get immediately overridden by the timer.
  const handleArrowClick = (dir) => {
    setIsPaused(true);
    scrollByDir(dir);
    window.clearTimeout(handleArrowClick._resumeTimer);
    handleArrowClick._resumeTimer = window.setTimeout(() => setIsPaused(false), 4000);
  };

  // Autoplay: advance one slide at a time on an interval. When we reach
  // (or pass) the midpoint of the doubled track, snap back to the start
  // without animating, so the loop is invisible.
  useEffect(() => {
    if (resolvedSlides.length <= 1) return;
    if (isPaused) return;

    const el = scrollRef.current;
    if (!el) return;

    const timer = window.setInterval(() => {
      if (!el) return;
      const width = cardWidth();
      const halfwayPoint = width * resolvedSlides.length;

      if (el.scrollLeft + width >= halfwayPoint) {
        el.scrollBy({ left: width, behavior: "smooth" });
        window.setTimeout(() => {
          el.scrollTo({ left: 0, behavior: "auto" });
        }, 400);
      } else {
        el.scrollBy({ left: width, behavior: "smooth" });
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, resolvedSlides.length, cardWidth]);

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

      {/* ===== IMAGE SLIDER (auto-playing) ===== */}
      <section className="bg-[#fceef3] py-16 overflow-hidden">
        <div className="px-8 md:px-16 flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#3a1020] mb-2">
              Highlights from Kalantar
            </h2>
            <div className="w-16 h-1 bg-[#a91846]"></div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleArrowClick(-1)}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-md border border-[#a91846]/30 bg-transparent flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} className="text-[#3a1020]" />
            </button>
            <button
              onClick={() => handleArrowClick(1)}
              aria-label="Next slide"
              className="w-10 h-10 rounded-md border border-[#a91846]/30 bg-transparent flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight size={18} className="text-[#3a1020]" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto px-8 md:px-16 scroll-smooth pb-4 scrollbar-hide"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {loopedSlides.map((s, i) => {
            const CardInner = (
              <>
                <img
                  src={s.img}
                  alt={s.caption || "Gallery image"}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {(s.caption || s.link) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a0b17]/90 via-[#2a0b17]/30 to-transparent flex flex-col justify-end p-5">
                    {s.caption && (
                      <p className="text-white text-lg font-bold font-serif leading-tight mb-1">
                        {s.caption}
                      </p>
                    )}
                    {s.link && (
                      <span className="inline-block text-xs font-semibold text-white bg-[#a91846] px-3 py-1 rounded-full w-fit">
                        {s.link_label || "Open Link"}
                      </span>
                    )}
                  </div>
                )}
              </>
            );

            const cardClasses =
              "relative flex-shrink-0 w-[80vw] sm:w-[45vw] lg:w-[26vw] xl:w-[24vw] h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-[#a91846]/10";

            return s.link ? (
              <a
                key={`${s.id}-${i}`}
                data-slide-card
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClasses}
              >
                {CardInner}
              </a>
            ) : (
              <div key={`${s.id}-${i}`} data-slide-card className={cardClasses}>
                {CardInner}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== GLOBAL PAGE ACTION BUTTON ===== */}
      {pageUrl && (
        <section className="px-8 md:px-16 pb-16 flex justify-center">
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span>{data[0]?.url_label || "Go to Link"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </section>
      )}

      {/* ===== FOOTER ===== */}


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
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}