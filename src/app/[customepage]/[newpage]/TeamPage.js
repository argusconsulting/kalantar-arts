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
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {Array.isArray(data) && data.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-rose-200 p-3 flex flex-col"
              >
                {/* Image Section - fixed 534x534 */}
                <div className="relative w-[534px] h-[534px] max-w-full mx-auto rounded-lg overflow-hidden border border-rose-200">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_Files_URL}/${member.image}`}
                    alt={member.name}
                    width={534}
                    height={534}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content Section */}
                <div className="pt-4 space-y-1">
                  <h2 className="text-lg font-bold text-rose-600">
                    {member.name}
                  </h2>
                  <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold block">
                    {member.role}
                  </span>

                  <p className="text-gray-600 text-sm leading-relaxed mt-2">
                    {member.description}
                  </p>

                  {/* Tags */}
                  {Array.isArray(member.tags) && member.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {member.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}