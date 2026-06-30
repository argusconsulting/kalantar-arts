import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Paintbrush,
  Landmark,
  Users,
  Sparkles,
} from "lucide-react";

export default function ChairmanPage({ data }) {
  const cmsImages = data?.[0]?.image ? data[0].image.split(',') : [];
  const heroImage = cmsImages[0] ? `${process.env.NEXT_PUBLIC_Files_URL}/${cmsImages[0]}` : "/images/chairman-hero.jpg";
  // If they only uploaded 1 image, use it for both spots to prevent a broken image!
  const profileImage = cmsImages[1] ? `${process.env.NEXT_PUBLIC_Files_URL}/${cmsImages[1]}` : (cmsImages[0] ? `${process.env.NEXT_PUBLIC_Files_URL}/${cmsImages[0]}` : "/images/chairman-profile.jpg");

  const pageTitle = data?.[0]?.name || "Message from the Chairman";
  const richTextContent = data?.[0]?.Richtext || `
    <p>एक सुसज्जित कला बिना किसी वाद विवाद के हमारे हृदय पर दीर्घकालिक प्रभाव छोड़ती है और बड़ी से बड़ी बात आसानी से समझा देती है। वहीं शब्दों से कुछ समझाने के प्रयास में सुलझे रिश्ते भी उलझ जाते हैं। बिना किसी दूसरे की सुने अपनी कह देना और हृदय पर अमिट प्रभाव छोड़ देना ही कला का जादू है।</p>
  `;

  let extraData = { profileBio: "", badgeText: "15+", features: [] };
  if (data?.[0]?.extra_data) {
    try {
      extraData = JSON.parse(data[0].extra_data);
    } catch (e) {
      console.error("Failed to parse extra_data", e);
    }
  }

  const profileBio = extraData?.profileBio || "As an advocate for the democratization of art, Vishal has dedicated over a decade to building a platform where talent meets opportunity, regardless of background or geography.";
  const badgeText = extraData?.badgeText;
  const authorName = extraData?.authorName || "VISHAL SRIVASTAVA";
  const authorDesignation = extraData?.authorDesignation || "CHAIRMAN – KALANTAR ART FOUNDATION";
  const heroDesc = extraData?.heroDesc || "Art has the power to inspire, connect communities, and create lasting impact. We believe in the transformative energy of creativity to bridge social divides.";
  const features = extraData?.features?.length > 0 ? extraData.features : [
    { title: "Art Foundation", desc: "Spotlighting emerging artists on global stages." },
    { title: "Cultural Preservation", desc: "Safeguarding heritage through digital archives." },
    { title: "Community Impact", desc: "Art workshops for underserved communities." },
    { title: "Creative Empowerment", desc: "Economic upliftment in traditional art forms." }
  ];

  const defaultIcons = [
    <Paintbrush key="paintbrush" size={20} />,
    <Landmark key="landmark" size={20} />,
    <Users key="users" size={20} />,
    <Sparkles key="sparkles" size={20} />
  ];

  return (
    <main className="bg-white text-[#2b2b2b]">




      {/* ===== QUOTE SECTION ===== */}
      <section className="px-8 md:px-24 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-[#3a1020] mb-8 leading-tight text-left">
          {pageTitle}
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          {/* Dynamic Chairman Photo Asset 1 */}
          <img
            src={heroImage}
            alt={pageTitle}
            className="w-72 h-80 object-cover rounded-md shadow-xl shrink-0"
          />

          <div className="flex flex-col justify-center pt-4 md:pt-10">
            <h2 className="text-2xl font-bold text-[#7a1430] mb-2 uppercase">
              {authorName}
            </h2>
            <p className="text-sm font-semibold tracking-widest text-gray-600 uppercase">
              {authorDesignation}
            </p>
          </div>
        </div>

        <div
          className="text-[#3a1020] text-base md:text-lg leading-relaxed w-full mt-2 text-justify tiptap-content prose max-w-none"
          dangerouslySetInnerHTML={{ __html: richTextContent }}
        ></div>

      </section>



    </main>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div>
      <div className="text-[#a91846] mb-2">{icon}</div>
      <p className="font-semibold text-sm text-[#2b2b2b] mb-1">{title}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
