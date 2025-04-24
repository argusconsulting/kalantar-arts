import Image from "next/image"

export default function Artpurpuse({data}) {

   
    return (
        <div className="px-4 md:px-20 py-8 w-full relative">
            {/* Header section */}
            <div className="border-l-4 border-pink-500 pl-4 my-3">
                <h2 className="text-gray-600 text-lg font-medium">Our Purpose</h2>
                <h1 className="text-3xl font-semibold text-gray-800">{data.title}</h1>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                {/* Left column with cards - takes 2/3 of width on large screens */}
                <div className="lg:col-span-2 flex flex-col justify-between">
                    {/* First row with 2 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Card 1 */}
                        <div className="border border-gray-200 p-6 rounded">
                            <h3 className="text-xl font-medium text-gray-800 mb-3">{data.firstbox_title}</h3>
                            <p className="text-gray-600">
                                {data.firstbox_description}
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="border border-gray-200 p-6 rounded">
                            <h3 className="text-xl font-medium text-gray-800 mb-3">{data.secondbox_title}</h3>
                            <p className="text-gray-600">
                                {data.secondbox_description}
                            </p>
                        </div>
                    </div>

                    {/* Second row with 2 cards stacked vertically */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        {/* Card 3 */}
                        <div className="border border-gray-200 p-6 rounded">
                            <h3 className="text-xl font-medium text-gray-800 mb-3">{data.thirdbox_title}</h3>
                            <p className="text-gray-600">
                                {data.thirdbox_description}
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="border border-gray-200 p-6 rounded">
                            <h3 className="text-xl font-medium text-gray-800 mb-3">{data.fourthbox_title}</h3>
                            <p className="text-gray-600">
                                {data.fourthbox_description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right column with full-height image */}
                <div className="lg:col-span-1">
                    <div className="h-full w-full flex items-stretch">
                        <Image
                             src={`${process.env.NEXT_PUBLIC_Files_URL}/${data.image}`}
                            alt="Colorful paintbrushes with paint"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
