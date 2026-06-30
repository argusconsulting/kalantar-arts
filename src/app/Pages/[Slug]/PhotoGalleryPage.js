"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Facebook, Instagram, Youtube, Phone, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const AUTOPLAY_INTERVAL_MS = 4000;

export default function PhotoGalleryPage({ data }) {
  const scrollRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Extract CMS Images if they exist
  const cmsImages = data?.[0]?.image ? data[0].image.split(',') : [];
  const currentUrls = data?.[0]?.image_urls ? data[0].image_urls.split(',') : [];
  const pageUrl = data?.[0]?.url;

  const [isPaused, setIsPaused] = useState(false);

  const hardcodedSlides = [
    { id: "h1", caption: "Winter Showcase 2023", link: null, link_label: null, img: "/images/gallery/highlight-1.jpg" },
    { id: "h2", caption: "Art for All Generations", link: null, link_label: null, img: "/images/gallery/highlight-2.jpg" },
    { id: "h3", caption: "The Ceramics Lab", link: null, link_label: null, img: "/images/gallery/highlight-3.jpg" },
    { id: "h4", caption: "The Closing Ceremony", link: null, link_label: null, img: "/images/gallery/highlight-4.jpg" },
  ];

  let extraData = {};
  try {
    if (data?.[0]?.extra_data) {
      extraData = JSON.parse(data[0].extra_data);
    }
  } catch (e) { }
  const imageNames = extraData?.imageNames || [];

  const resolvedSlides = cmsImages.length > 0
    ? cmsImages.map((imgName, idx) => {
      const customName = imageNames[idx]?.trim();
      const customUrl = currentUrls[idx]?.trim();
      return {
        id: `slide-${idx}`,
        caption: customName || "",
        link: customUrl && customUrl !== "#" ? customUrl : null,
        link_label: data[0]?.url_label || "Open Link", // Fallback label
        img: `${process.env.NEXT_PUBLIC_Files_URL}/${imgName}`,
      };
    })
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  draggable={false}
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  {s.link ? (
                    <div className="bg-white/90 text-pink-700 px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                      Click here
                    </div>
                  ) : (
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 w-12 h-12 drop-shadow-lg" />
                  )}
                </div>

                {(s.caption) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a0b17]/90 via-[#2a0b17]/30 to-transparent flex flex-col justify-end p-5 pointer-events-none">
                    <p className="text-white text-lg font-bold font-serif leading-tight mb-1">
                      {s.caption}
                    </p>
                  </div>
                )}
              </>
            );

            const cardClasses =
              "relative flex-shrink-0 w-[80vw] sm:w-[45vw] lg:w-[26vw] xl:w-[24vw] h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-[#a91846]/10 group";

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
              <div
                key={`${s.id}-${i}`}
                data-slide-card
                className={`${cardClasses} cursor-pointer`}
                onClick={() => setSelectedImage(s.img)}
              >
                {CardInner}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== GLOBAL PAGE ACTION BUTTON ===== */}
      {pageUrl && (
        <section className="px-8 md:px-16 py-12 flex justify-center mt-8">
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