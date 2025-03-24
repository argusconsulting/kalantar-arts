"use client";
import Image from "next/image";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
export default function ContactUs({ data }) {
  const [showPopup, setShowPopup] = useState(false);

  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    if (phone.length !== 10) return "Phone number must be 10 digits";
    if (!/^\d+$/.test(phone)) return "Only numbers are allowed";
    return "";
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = value;
    setPhoneError(validatePhone(value));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const phone = e.target.phone.value;
    const error = validatePhone(phone);
    
    if (error) {
      setPhoneError(error);
      return;
    }
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact_submissions`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setShowPopup(true); // Show popup on success
        e.target.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error sending your message. Please try again.');
    }
  };
  return (
    <div className="container mx-auto p-6 md:p-12 md:mt-32 mt-36 mb-10 bg-gray-50 rounded-lg shadow-xl">




{showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Thank You!
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>We've received your message and will get back to you soon.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Contact Us</h1>

      {/* Grid Layout for Map and Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-8 mb-10">
        {/* Google Map Section */}
        <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-md border border-gray-300">
          <iframe
            className="w-full h-full"
            src={data.G_Map}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Get in Touch</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
  <input
    type="text"
    name="name"
    placeholder="Your Name"
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <input
    type="email"
    name="email"
    placeholder="Your Email"
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
   <div>
          <input
            type="tel"  // Better for phone numbers than type="number"
            name="phone"
            placeholder="Your Mobile Number"
            className={`w-full p-3 border ${phoneError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onChange={handlePhoneChange}
            pattern="\d{10}"
            inputMode="numeric"  // Shows numeric keyboard on mobile
            maxLength={10}
            required
          />
          {phoneError && (
            <p className="mt-1 text-sm text-red-600">{phoneError}</p>
          )}
        </div>
  <textarea
    name="message"
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
       

<div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 max-w-lg mx-auto text-center">
  {/* Heading */}
  <h2 className="text-3xl font-bold text-gray-800 mb-4">📍 Our Office</h2>

  {/* Address Section */}
  <div className="text-left space-y-3">
    <div className="text-gray-700 flex items-center gap-2">
      <FaMapMarkerAlt className="text-red-500 text-xl" />
      <div className=" flex flex-col">
     <span> {data.address}</span>
      <span>{data.adress2}</span>
      </div>
    </div>
    

    <p className="text-gray-700 flex items-center gap-2">
      <FaPhoneAlt className="text-green-500 text-xl" />
      <a href={`tel:${data.contact_no}`} className="text-blue-600 hover:text-blue-700 transition">
        {data.contact_no}
      </a>
    </p>

    <p className="text-gray-700 flex items-center gap-2">
      <FaEnvelope className="text-yellow-500 text-xl" />
      <a href={`mailto:${data.email}`} className="text-blue-600 hover:text-blue-700 transition">
        {data.email}
      </a>
    </p>
  </div>

  {/* WhatsApp Button */}
  <div className="mt-6">
    <a
      href={`https://wa.me/91${data.whatsapp_no}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-green-600 shadow-md transition-all duration-300"
    >
      <FaWhatsapp className="text-white text-2xl" />
      Chat on WhatsApp
    </a>
  </div>
</div>

      </div>
    </div>
  );
}