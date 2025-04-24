import Image from "next/image";
import Link from "next/link";


export default function ArtInitiatives({ data }) {
  return (
    <div className="relative mx-auto px-4 md:px-20 py-8">
      {/* Header */}
      <div className="mb-6 relative">
        <div className="border-l-4 border-pink-500 pl-4">
          <p className="text-pink-500 font-medium">Latest Happenings</p>
          <h1 className="text-3xl font-serif font-medium text-gray-800 mt-1">
            Art, Events & Initiatives
          </h1>
        </div>
        <p className="text-gray-600 mt-3 max-w-3xl">
          Learn about projects using art for education, rehabilitation, and positive change in society.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[...data]
          .sort((a, b) => a.id - b.id)
          .slice(0, 3)
          .map((item, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-md bg-white"
            >
              <div className="relative h-48">
                <Image
                  src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.image}`}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 bg-[#F8F8F8]">
                <div className="flex items-start mb-3">
                  <div className="flex flex-col items-center mr-4 border-r-4 border-[#FFC909] px-3">
                    <span className="text-gray-700 font-medium">{item.date_month}</span>
                    <span className="text-2xl font-bold text-gray-800">{item.date_day}</span>
                  </div>
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                {/* <Link
                href={item.link}
                className="text-blue-600 text-sm font-medium inline-flex items-center"
              >
                Read More <span className="ml-1">→</span>
              </Link> */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
