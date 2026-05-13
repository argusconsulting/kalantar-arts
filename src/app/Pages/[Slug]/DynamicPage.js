"use client";
import "react-quill-new/dist/quill.snow.css"; // Quill styles
import Link from "next/link";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const DynamicPage = ({ data }) => {
  if (!data[0]?.Richtext) {
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

  return (
    <div className="min-h-screen flex flex-col items-center mt-20 py-12 justify-center bg-gray-100 text-gray-900 px-4 lg:px-20">
      <div className="w-full  h-full">
      
        <ReactQuill
        value={data[0].Richtext || ""}
        readOnly={true}
        theme="bubble" // Use "bubble" or "snow" for styling
      />
      </div>
    </div>
  );
};

export default DynamicPage;
