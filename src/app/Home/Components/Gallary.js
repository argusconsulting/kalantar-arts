import Image from 'next/image';
import Link from 'next/link';
// import { ArrowRight, Link } from "lucide-react"

const Gallary = ({ data }) => {
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
              href={data.find(item => item.id === id)?.link} 
              className="absolute cursor-pointer justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex w-full opacity-85 text-white px-3 py-1 text-sm"
            >
              <span>{data.find(item => item.id === id)?.caption}</span>
              <span className="border-2 border-white rounded-full p-1">
                {/* <ArrowRight className="h-4 w-4" /> */}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallary;