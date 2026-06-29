"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicPage = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!data[0]?.Richtext && !data[0]?.image) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200 text-pink-900 px-6">
        <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md w-full">
          <h1 className="text-6xl font-extrabold text-pink-600 animate-pulse mb-4">Coming Soon</h1>
          <p className="text-lg text-pink-700 mb-6">
            We’re crafting something beautiful just for you. Stay tuned!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 text-white bg-pink-600 rounded-lg shadow hover:bg-pink-700 transition-colors duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const rawPageUrl = data[0]?.url?.trim();
  const pageUrl = rawPageUrl ? (rawPageUrl.startsWith("http") ? rawPageUrl : `https://${rawPageUrl}`) : null;

  const extractYouTubeId = (urlStr) => {
    if (!urlStr) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center mt-20 py-12 justify-center bg-gray-50 text-gray-900 px-4 lg:px-20">
      <div className="w-full h-full max-w-6xl bg-white p-8 md:p-12 rounded-3xl shadow-md border border-gray-100">

        {/* Page Heading */}
        {data[0].name && (
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              {data[0].name}
            </h1>
            <div className="w-24 h-1.5 bg-pink-500 mx-auto mt-6 rounded-full"></div>
          </div>
        )}

        {/* Render Saved Images as a Perfectly Aligned Uniform Grid */}
        {data[0].image && (
          <div className="mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {data[0].image.split(',').map((img, idx) => {
              const currentUrls = data[0].image_urls ? data[0].image_urls.split(',') : [];
              const cleanUrl = currentUrls[idx]?.trim();
              const specificUrl = cleanUrl && cleanUrl !== "null" && cleanUrl !== ""
                ? (cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`)
                : null;

              return (
                <div key={idx} className="flex flex-col relative rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white border border-gray-100">

                  {/* The Image (Click to Link OR Zoom) */}
                  {specificUrl ? (
                    <a
                      href={specificUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block overflow-hidden bg-gray-100 aspect-square group"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_Files_URL}/${img}`}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-3">
                          <span className="bg-white/95 text-pink-600 px-4 py-2 rounded-full font-bold shadow-xl flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            Visit Partner
                          </span>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div
                      className="relative cursor-pointer overflow-hidden bg-gray-100 aspect-square group"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_Files_URL}/${img}`}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-3">
                          <span className="bg-white/95 text-pink-600 px-4 py-2 rounded-full font-bold shadow-xl flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                            Zoom
                          </span>
                        </div>
                      </div>
                    </div>
                  )}


                </div>
              );
            })}
          </div>
        )}

        {/* Render YouTube Videos Grid */}
        {data[0].youtube_urls && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Videos</h3>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="flex flex-col max-w-4xl mx-auto gap-12">
              {data[0].youtube_urls.split(',').map((ytUrl, idx) => {
                const videoId = extractYouTubeId(ytUrl);
                if (!videoId) return null;
                return (
                  <div key={idx} className="relative rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-black border border-gray-100 aspect-video">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`YouTube video ${idx + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rich Text Content */}
        {data[0].Richtext && (
          <div className="prose max-w-none tiptap-content" dangerouslySetInnerHTML={{ __html: data[0].Richtext }} />
        )}

        {/* Huge Bottom Action Button */}
        {pageUrl && (
          <div className="mt-12 mb-4 flex justify-center">
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-pink-600 text-white font-bold text-lg rounded-full shadow-xl hover:bg-pink-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {data[0].url_label || "Go to Link"}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        )}

      </div>

      {/* Lightbox / Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black bg-opacity-95 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full flex flex-col items-center animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 md:-right-10 text-white/70 hover:text-white text-5xl transition-colors font-light"
            >
              &times;
            </button>

            <img
              src={`${process.env.NEXT_PUBLIC_Files_URL}/${selectedImage}`}
              alt="Gallery zoom"
              className="w-auto max-h-[75vh] object-contain rounded-sm shadow-2xl border-4 border-white/10"
            />

            {/* Clickable Link inside the Lightbox! */}
            {pageUrl && (
              <div className="mt-8">
                <a
                  href={pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(219,39,119,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(219,39,119,0.7)] flex items-center gap-2"
                >
                  {data[0].url_label || "Visit Link"}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DynamicPage;
