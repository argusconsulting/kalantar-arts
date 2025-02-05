import Image from "next/image";

const Headlight = ({ highlight1 }) => {
  // Get the first matching item with id === 1
  const item = highlight1;

  if (!item) {
    return <div>No highlight found.</div>;
  }

  return (
    <section className="h-full w-full flex items-center justify-center">
      <div className="w-full h-full">
        <Image
          
          src={`/Uploads/${item.image}`}
          alt="headlight"
          width={1920}
          height={546}
          layout="responsive"
          objectFit="cover"
          className="object-cover"
        />
      </div>
    </section>
  );
};

export default Headlight;
