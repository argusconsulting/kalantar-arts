import Image from 'next/image';
import Link from 'next/link';
// import { ArrowRight, Link } from "lucide-react"

const Gallary = ({ data }) => {
  const formatLink = (link) => {
    if (!link || link === '#') return '#';
    if (!link.startsWith('http://') && !link.startsWith('https://') && !link.startsWith('/')) {
      return `https://${link}`;
    }
    return link;
  };

  return (
    <div className="p-5 mt-14 bg-gray-50">
      {/* Grid Container */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-4 md:h-[90vh] h-auto">
        {/* Text Content */}
        <div className="md:col-span-2 col-span-1  md:p-8 p-2 flex flex-col justify-center">
          <div className="border-l-4 border-pink-500 pl-4 my-3">
            <h2 className="text-gray-600 text-lg font-medium">Captured Moments</h2>
            <h1 className="text-3xl font-semibold text-gray-800">A Glimpse into the Creativity</h1>
          </div>
          <p className="text-gray-600 text-sm max-w-3xl">
            Step into a world of colors, expressions, and stories through our photo gallery. From artists passionately 
            crafting their masterpieces to the vibrant energy of exhibitions and workshops, these snapshots celebrate 
            the spirit of creativity and cultural heritage. Each image is a testament to the impact of art in shaping 
            lives and communities.
          </p>
        </div>

        {/* Gallery Items */}
        {[4, 5, 6, 2, 3, 7, 8, 9].map((id, index) => (
          <div key={id} className={`
            relative rounded-md shadow-md overflow-hidden h-64 md:h-auto
            ${id === 4 ? 'md:row-start-1 md:row-end-2 md:col-start-4 md:col-end-5' : ''}
            ${id === 5 ? 'md:row-start-2 md:row-end-3 md:col-start-4 md:col-end-5' : ''}
            ${id === 6 ? 'md:row-start-3 md:row-end-4 md:col-start-4 md:col-end-5' : ''}
            ${id === 2 ? 'md:row-start-4 md:row-end-5 md:col-start-3 md:col-end-5' : ''}
            ${id === 3 ? 'md:row-start-2 md:row-end-4 md:col-start-3 md:col-end-4' : ''}
            ${id === 7 ? 'md:row-start-4 md:row-end-5 md:col-start-2 md:col-end-3' : ''}
            ${id === 8 ? 'md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-2' : ''}
            ${id === 9 ? 'md:row-start-3 md:row-end-4 md:col-start-2 md:col-end-3' : ''}
          `}>
            <Image
              src={`${process.env.NEXT_PUBLIC_Files_URL}/${data.find(item => item.id === id)?.image}`}
              alt="Gallery image"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            <Link
              href={formatLink(data.find(item => item.id === id)?.link)} 
              target={formatLink(data.find(item => item.id === id)?.link).startsWith('http') ? "_blank" : undefined}
              rel={formatLink(data.find(item => item.id === id)?.link).startsWith('http') ? "noopener noreferrer" : undefined}
              className="absolute cursor-pointer justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex w-full opacity-85 text-white px-3 py-2 text-sm min-h-[36px]"
            >
              <span>{data.find(item => item.id === id)?.caption || "\u00A0"}</span>
              {data.find(item => item.id === id)?.link_label && (
                <span className="flex items-center gap-1 font-semibold hover:underline">
                  {data.find(item => item.id === id)?.link_label}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </span>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallary;