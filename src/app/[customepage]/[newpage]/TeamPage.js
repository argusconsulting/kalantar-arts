// app/page.jsx
import Image from 'next/image'

export default function TeamPage({ data,title }) {


  return (
    <div className="min-h-screen mt-20 bg-rose-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h1 className="text-4xl font-bold text-rose-900 uppercase tracking-tight">
            {title.replace(/-/g, ' ')}
          </h1>
          <div className="h-1 w-20 bg-rose-300 mx-auto" />
        </div>

        <div className="space-y-20">
          {data.map((member, index) => (
            <div
              key={member.name}
              className={`flex flex-col md:flex-row items-center gap-12 md:gap-16`}
            >
              {/* Image Section */}
              <div className="relative  w-full md:w-5/12 h-80 rounded-2xl overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_Files_URL}/${member.image}`}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Content Section */}
              <div className="w-full md:w-7/12 space-y-5 text-center md:text-left">
                <div className="space-y-2">
                 
                  <h2 className="text-3xl font-bold text-rose-900">
                    {member.name}
                  </h2>
                  <span className="text-sm uppercase tracking-widest text-rose-600 font-medium">
                    {member.role}
                  </span>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                  {member.description}
                </p>
                
                <div className="hidden md:block h-px bg-rose-100/80 mt-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}