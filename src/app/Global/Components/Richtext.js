import DOMPurify from "dompurify";

const Richtext = ({ data }) => {
  const sanitizedHTML = DOMPurify.sanitize(
    (data?.description || "").replace(/<img /g, '<img loading="lazy" ')
  );

  return (
    <div className="my-8 lg:my-14 text-lg lg:text-2xl font-normal px-4 lg:px-2">
      <div className="text-left tiptap-content prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedHTML }}></div>
    </div>
  );
};

export default Richtext;
