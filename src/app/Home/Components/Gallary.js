
import Image from 'next/image';
import { ArrowRight } from "lucide-react"

const Gallary = () => {
    return (
        <div className="min-h-screen p-5 mt-14 bg-gray-50">
            {/* Grid Container */}
            <div className="grid grid-cols-4 grid-rows-4 gap-4 h-[90vh]">
                {/* Text Content (div9) */}
                <div className="row-span-1 col-span-2 p-8  flex flex-col justify-center">
                    {/* <h1 className="text-4xl font-bold text-gray-800 mb-2">Captured Moments</h1>
          <h2 className="text-2xl text-gray-600 mb-4">A Glimpse into the Creativity</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Step into a world of colors, expressions, and stories through our photo gallery. 
            From artists passionately crafting their masterpieces to the vibrant energy of 
            exhibitions and workshops, these snapshots celebrate the spirit of creativity 
            and cultural heritage. Each image is a testament to the impact of art in shaping 
            lives and communities.
          </p>
          <a 
            href="#" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors self-start"
          >
            View More
          </a> */}

                    <div className="border-l-4 border-pink-500 pl-4 my-3">
                        <h2 className="text-gray-600 text-lg font-medium">Captured Moments</h2>
                        <h1 className="text-3xl font-semibold text-gray-800">A Glimpse into the Creativity</h1>
                        
                    </div>
                    <p className="text-gray-600 text-sm max-w-3xl">
                            Step into a world of colors, expressions, and stories through our photo gallery. From artists passionately crafting their masterpieces to the vibrant energy of exhibitions and workshops, these snapshots celebrate the spirit of creativity and cultural heritage. Each image is a testament to the impact of art in shaping lives and communities.
                        </p>
                </div>

                {/* Gallery Items */}
                <div className="relative rounded-md shadow-md overflow-hidden row-start-1 row-end-2 col-start-4 col-end-5">
                    <Image
                        src={`/Images/111.JPG`}
                        alt="Gallery image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex  w-full  opacity-85 text-white px-3 py-1 text-sm">
                    <span className=' h-full items-center'>Kalantar Image Gallery</span>
                    <span className=' border-2 border-white rounded-full p-1'><ArrowRight className="h-4 w-4" /></span>
                    </div>
                </div>

                <div className="relative rounded-md shadow-md overflow-hidden row-start-2 row-end-3 col-start-4 col-end-5">
                    <Image
                        src={`/Images/IMG_5845.jpg`}
                        alt="Gallery image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                     <div className="absolute justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex  w-full  opacity-85 text-white px-3 py-1 text-sm">
                    <span className=' h-full items-center'>Kalantar Image Gallery</span>
                    <span className=' border-2 border-white rounded-full p-1'><ArrowRight className="h-4 w-4" /></span>
                    </div>
                </div>

                <div className="relative rounded-md shadow-md overflow-hidden row-start-3 row-end-4 col-start-4 col-end-5">
                    <Image
                        src={`/Images/IMG_1313.JPG`}
                        alt="Gallery image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                     <div className="absolute justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex  w-full  opacity-85 text-white px-3 py-1 text-sm">
                    <span className=' h-full items-center'>Kalantar Image Gallery</span>
                    <span className=' border-2 border-white rounded-full p-1'><ArrowRight className="h-4 w-4" /></span>
                    </div>
                </div>

                <div className="relative rounded-md shadow-md overflow-hidden row-start-4 row-end-5 col-start-3 col-end-5">
                    <Image
                        src={`/Images/_DSC1922.JPG`}
                        alt="Gallery image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex  w-full  opacity-85 text-white px-3 py-1 text-sm">
                    <span className=' h-full items-center'>Kalantar Image Gallery</span>
                    <span className=' border-2 border-white rounded-full p-1'><ArrowRight className="h-4 w-4" /></span>
                    </div>
                </div>

                <div className="relative rounded-md shadow-md overflow-hidden row-start-2 row-end-4 col-start-3 col-end-4">
                    <Image
                        src={`/Images/DSC_0943.JPG`}
                        alt="Gallery image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                     <div className="absolute justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex  w-full  opacity-85 text-white px-3 py-1 text-sm">
                    <span className=' h-full items-center'>Kalantar Image Gallery</span>
                    <span className=' border-2 border-white rounded-full p-1'><ArrowRight className="h-4 w-4" /></span>
                    </div>
                </div>

                <div className="relative rounded-md shadow-md overflow-hidden row-start-4 row-end-5 col-start-2 col-end-3">
                    <Image
                        src={`/Images/20231021_124627.jpg`}
                        alt="Gallery image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex  w-full  opacity-85 text-white px-3 py-1 text-sm">
                    <span className=' h-full items-center'>Kalantar Image Gallery</span>
                    <span className=' border-2 border-white rounded-full p-1'><ArrowRight className="h-4 w-4" /></span>
                    </div>
                </div>

                <div className="relative rounded-md shadow-md overflow-hidden row-start-4 row-end-5 col-start-1 col-end-2">
                    <Image
                        src={`/Images/20231011_121211.jpg`}
                        alt="Gallery image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex  w-full  opacity-85 text-white px-3 py-1 text-sm">
                    <span className=' h-full items-center'>Kalantar Image Gallery</span>
                    <span className=' border-2 border-white rounded-full p-1'><ArrowRight className="h-4 w-4" /></span>
                    </div>
                </div>

                <div className="relative rounded-md shadow-md overflow-hidden row-start-3 row-end-4 col-start-2 col-end-3">
                    <Image
                        src={`/Images/20230927_141845.jpg`}
                        alt="Gallery image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                     <div className="absolute justify-between items-center bottom-0 left-0 right-0 bg-[#E84691D9] flex  w-full  opacity-85 text-white px-3 py-1 text-sm">
                    <span className=' h-full items-center'>Kalantar Image Gallery</span>
                    <span className=' border-2 border-white rounded-full p-1'><ArrowRight className="h-4 w-4" /></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallary;