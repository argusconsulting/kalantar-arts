"use client";
import { useRef, useState } from "react";
import { Facebook, Instagram, Youtube, Phone, ChevronLeft, ChevronRight, Play } from "lucide-react";

export default function VideoGalleryPage({ data }) {
  const scrollRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Extract URLs if they exist
  const ytUrls = data?.[0]?.youtube_urls ? data[0].youtube_urls.split(',') : [];
  const pageUrl = data?.[0]?.url;

  const parseVideoUrl = (urlStr) => {
    if (!urlStr) return null;

    // Check for Google Drive
    const driveMatch = urlStr.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || urlStr.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return { type: 'gdrive', id: driveMatch[1] };
    }

    // Check for YouTube
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = urlStr.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
      return { type: 'youtube', id: ytMatch[2] };
    }

    return null;
  };

  let extraData = {};
  try {
    if (data?.[0]?.extra_data) {
      extraData = JSON.parse(data[0].extra_data);
    }
  } catch (e) { }
  const youtubeNames = extraData?.youtubeNames || [];
  const youtubeThumbnails = extraData?.youtubeThumbnails || [];

  const hardcodedHighlights = [
    { caption: "Winter Showcase 2023", sub: "EXHIBITIONS", video: { type: 'youtube', id: "t0wO9FhR37o" } },
    { caption: "Art for All Generations", sub: "COMMUNITY OUTREACH", video: { type: 'youtube', id: "dQw4w9WgXcQ" } },
    { caption: "The Ceramics Lab", sub: "WORKSHOP", video: { type: 'youtube', id: "jNQXAC9IVRw" } },
    { caption: "The Closing Ceremony", sub: "EVENT", video: { type: 'youtube', id: "cVDjE5X1vL8" } },
  ];

  // If CMS has videos, use them for highlights. Otherwise fallback.
  const highlights = ytUrls.length > 0
    ? ytUrls.map((url, idx) => {
      const customName = youtubeNames[idx]?.trim();
      const customThumb = youtubeThumbnails[idx]?.trim();
      return {
        caption: customName ? customName : `Video Highlight ${idx + 1}`,
        sub: "KALANTAR ARTS",
        video: parseVideoUrl(url),
        thumb: customThumb ? `${process.env.NEXT_PUBLIC_Files_URL}/${customThumb}` : null
      };
    }).filter(h => h.video)
    : hardcodedHighlights;

  // If CMS has videos, format them to match the gallery structure. Otherwise, fallback.
  const galleryItems = ytUrls.length > 0
    ? ytUrls.map((url, idx) => {
      const customName = youtubeNames[idx]?.trim();
      const customThumb = youtubeThumbnails[idx]?.trim();
      return {
        caption: customName ? customName : (data[0]?.name || "Kalantar Videos"),
        sub: "Video Gallery",
        video: parseVideoUrl(url),
        thumb: customThumb ? `${process.env.NEXT_PUBLIC_Files_URL}/${customThumb}` : null
      };
    }).filter(h => h.video)
    : hardcodedHighlights;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  return (
    <main className="bg-white text-[#2b2b2b]">


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
              onClick={() => setSelectedVideo({ type: h.video.type, id: h.video.id })}
            >
              {h.thumb ? (
                <img
                  src={h.thumb}
                  alt={h.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : h.video.type === 'youtube' ? (
                <img
                  src={`https://img.youtube.com/vi/${h.video.id}/maxresdefault.jpg`}
                  alt={h.caption}
                  onError={(e) => { e.target.src = `https://img.youtube.com/vi/${h.video.id}/hqdefault.jpg`; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#3a1020] to-[#1c080f] group-hover:scale-105 transition-transform duration-500"></div>
              )}
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

      {/* ===== VIDEO GALLERY GRID =====
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
      </section> */}

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

      {/* Lightbox / Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black bg-opacity-95 p-4 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative max-w-6xl w-full aspect-video flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 md:-top-10 md:-right-10 text-white/70 hover:text-white text-5xl transition-colors font-light"
            >
              &times;
            </button>
            <iframe
              className="w-full h-full rounded-xl shadow-2xl bg-black"
              src={selectedVideo.type === 'youtube' ? `https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1` : `https://drive.google.com/file/d/${selectedVideo.id}/preview`}
              title="Video player"
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
