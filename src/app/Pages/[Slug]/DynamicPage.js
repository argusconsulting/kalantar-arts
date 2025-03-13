"use client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styles
import Link from "next/link";

const DynamicPage = ({ data }) => {
  if (!data[0]?.Richtext) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 px-4 lg:px-20">
        <h2 className="text-5xl font-bold text-red-600">404</h2>
        <p className="text-xl mt-2">Oops! The page you&#39;re looking for doesn&#39;t exist.</p>
        <Link
          href="/"
          className="mt-4 px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Return Home
        </Link>
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
