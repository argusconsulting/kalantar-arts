import Image from "next/image"

export default function Artpurpuse() {
    return (
        <div className="px-4 md:px-20 py-8 w-full relative">
            {/* Header section */}
            <div className="border-l-4 border-pink-500 pl-4 my-3">
                <h2 className="text-gray-600 text-lg font-medium">Our Purpose</h2>
                <h1 className="text-3xl font-semibold text-gray-800">Empowering Art & Artists</h1>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                {/* Left column with cards - takes 2/3 of width on large screens */}
                <div className="lg:col-span-2 flex flex-col justify-between">
                    {/* First row with 2 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Card 1 */}
                        <div className="border border-gray-200 p-6 rounded">
                            <h3 className="text-xl font-medium text-gray-800 mb-3">Global Recognition for Artists</h3>
                            <p className="text-gray-600">
                                By bridging the gap between local talent and international opportunities, we connect emerging artists with
                                platforms, exhibitions, and collaborations that expand their reach and influence.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="border border-gray-200 p-6 rounded">
                            <h3 className="text-xl font-medium text-gray-800 mb-3">Preserving Cultural Heritage</h3>
                            <p className="text-gray-600">
                                Dedicated to reviving and promoting India&apos;s rich artistic traditions, we support artisans by creating
                                opportunities to sustain their craft while adapting to contemporary markets.
                            </p>
                        </div>
                    </div>

                    {/* Second row with 2 cards stacked vertically */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        {/* Card 3 */}
                        <div className="border border-gray-200 p-6 rounded">
                            <h3 className="text-xl font-medium text-gray-800 mb-3">Art for Social Change</h3>
                            <p className="text-gray-600">
                                Through initiatives like rehabilitation programs, art education workshops, and community-driven projects,
                                we use creativity as a tool to inspire, heal, and empower individuals from diverse backgrounds.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="border border-gray-200 p-6 rounded">
                            <h3 className="text-xl font-medium text-gray-800 mb-3">Fostering Artistic Excellence</h3>
                            <p className="text-gray-600">
                                We nurture creativity by providing education, mentorship, and platforms for artists to refine their skills
                                and gain visibility, helping them build sustainable careers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right column with full-height image */}
                <div className="lg:col-span-1">
                    <div className="h-full w-full flex items-stretch">
                        <Image
                            src="/Images/DSC_0943.JPG"
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
