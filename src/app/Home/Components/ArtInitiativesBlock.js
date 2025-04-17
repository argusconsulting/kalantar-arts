import Image from "next/image";
import Link from "next/link";

const initiatives = [
  {
    date: { month: "Jan", day: "26/27" },
    title: "Handicraft and handloom exports from Kashmir at ₹2,567 crore over the last two fiscal years",
    description:
      "A unique Collaborative Art Camp connecting professional artists with the underprivileged junior artists​",
    image: "/Uploads/Petals/WhatsApp Image 2024-12-17 at 18.38.38.png",
    link: "#",
   
  },
  {
    date: { month: "Feb", day: "09" },
    title: "An Educative Nukkad Natak​ Celebration of 1 year of India’s 1st (Model) Art Village of India​",
    description:
      "The handloom sector turnover increased about five-fold and production of Khadi rose three times in the last nine years demonstrating the resurgence of traditional Indian textiles in the...",
    image: "/Uploads/Petals/WhatsApp Image 2024-12-17 at 18.38.38.png",
    link: "#",
    
  },
  {
    date: { month: "March", day: "29" },
    title: "Kalantar kids were invited to Water Park by Worlds of Wonder to enjoy the fun of water waves in the approaching heat waves​",
    description:
      "As Onam approaches, the Kerala handloom sector is worried that it may miss the bus in making good gains in its premier sales season due to the closure of spinning mills in Coimb...",
    image: "/Uploads/Petals/WhatsApp Image 2024-12-17 at 18.38.38.png",
    link: "#",
  
  },
];

export default function ArtInitiatives( {data}) {
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
        {data.map((item, index) => (
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
