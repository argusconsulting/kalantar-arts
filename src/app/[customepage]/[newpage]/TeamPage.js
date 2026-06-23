// app/page.jsx
import Image from 'next/image'

export default function TeamPage({ data, title, subtitle }) {

  // Split title to color the 2nd word (e.g. "Visionaries") in rose
  const titleWords = title.replace(/-/g, ' ').split(' ');

  return (
    <div className="min-h-screen mt-20">
      {/* Pink gradient header */}
      <div className="bg-gradient-to-b from-rose-200 via-rose-100 to-rose-50 pt-16 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {titleWords.map((word, i) => (
              <span
                key={i}
                className={i === 1 ? "text-rose-600" : "text-gray-900"}
              >
                {word}{i < titleWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          {subtitle && (
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="h-1 w-20 bg-rose-300 mx-auto" />
        </div>
      </div>

      {/* White card panel, pulled up to overlap the pink header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-16">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-12 border border-gray-100">
          <div className="flex flex-col gap-12">
            {Array.isArray(data) && data.map((member, index) => {
              // Optional: Alternate layout (left-right, right-left) based on even/odd index
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={member.name}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center md:items-start bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-rose-100 hover:shadow-md transition-shadow duration-300`}
                >
                  {/* Image Section */}
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md border-4 border-white">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_Files_URL}/${member.image}`}
                        alt={member.name}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full md:w-2/3 flex flex-col pt-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                      {member.name}
                    </h2>
                    <span className="text-sm uppercase tracking-widest text-rose-600 font-bold mb-4 block">
                      {member.role}
                    </span>

                    <div className="w-12 h-1 bg-rose-200 mb-6 rounded-full"></div>

                    {/* Check if description has HTML tags (from tiptap) or is plain text */}
                    {member.description?.includes('<') && member.description?.includes('>') ? (
                      <div 
                        className="prose prose-sm sm:prose-base max-w-none text-gray-600 leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: member.description }} 
                      />
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {member.description}
                      </p>
                    )}

                    {/* Tags */}
                    {Array.isArray(member.tags) && member.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6">
                        {member.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 font-bold shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}