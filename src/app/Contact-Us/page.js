export default function ContactUs() {
  return (
    <div className="container mx-auto p-6 md:p-12 md:mt-32 mt-36 mb-10 bg-gray-50 rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Contact Us</h1>
      
      {/* Grid Layout for Map and Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-8 mb-10">
        {/* Google Map Section */}
        <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-md border border-gray-300">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509217!2d144.95592831550406!3d-37.81720974202153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1611836791527!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        
        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Get in Touch</h2>
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Your Number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')" 
	  minlength='10' maxlength='10'
              required
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      <div className="container mx-auto">
        {/* NGO Details */}
        

        {/* Contact Information */}
        <div className="text-center bg-white shadow-md rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
          <p className="text-xl font-semibold text-gray-700">Our Office</p>
          <p className="text-gray-600">29-A, Sector-93B, Noida, UTTAR PRADESH 201304, IN</p>
          <p className="text-gray-600">📞 Phone: <a href="tel:+1234567890" className="hover:text-blue-500">+1 234 567 890</a></p>
          <p className="text-gray-600">✉️ Email: <a href="mailto:contact@company.com" className="hover:text-blue-500">contact@company.com</a></p>

          {/* WhatsApp Link */}
          <div className="mt-5">
            <a
              href="https://wa.me/918758704414"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-6 h-6"
              />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}