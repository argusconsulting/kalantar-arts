import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h2 className="text-5xl font-bold text-red-600">404</h2>
      <p className="text-xl mt-2">Oops! The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="mt-4 px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
