"use client"

import { useState } from "react"
import Script from "next/script"
import { Martel } from "next/font/google"
import {
  TextField, Button, IconButton, MenuItem, Select, FormControl,
  InputLabel, Checkbox, FormControlLabel, Accordion, AccordionSummary,
  AccordionDetails, Typography, Box, Card, CardContent, CircularProgress,
  Alert, Snackbar, Dialog, DialogContent, DialogActions // Added Dialog imports
} from "@mui/material"
import {
  LocationOn, Remove, Add, ChevronLeft, ChevronRight, ExpandMore, CheckCircle // Added CheckCircle
} from "@mui/icons-material"
import Image from "next/image"
import { festivalData } from "./festivalData"

const martel = Martel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-martel",
})

export default function ArtFestivalClient({ initialAvailableTickets }) {
  // --- STATE ---
  const [delegates, setDelegates] = useState(1)
  const [activeSlide, setActiveSlide] = useState(1)
  const [expanded, setExpanded] = useState("panel0")
  const [category, setCategory] = useState("")
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)

  // Use prop from server, default to 0 if undefined
  const [availableTickets, setAvailableTickets] = useState(initialAvailableTickets)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "", open: false })

  // State for Success Popup
  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "", org: "", mobile: "", email: "", city: ""
  })

  const { speakers } = festivalData
  const PRICE_STANDARD = 1999;
  const PRICE_BULK = 1499;


  // Helper to determine the current price per person based on quantity
  const getPricePerTicket = () => {
    return delegates >= 6 ? PRICE_BULK : PRICE_STANDARD;
  };

  // Calculate total based on the dynamic unit price
  const calculateTotal = () => {
    return delegates * getPricePerTicket();
  };




  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % speakers.length)
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + speakers.length) % speakers.length)
  const handleAccordionChange = (panel) => (event, isExpanded) => setExpanded(isExpanded ? panel : false)

  // --- ROBUST BOOKING FLOW ---
  const handleBooking = async () => {
    // 1. Validation
    if (!formData.name || !formData.email || !formData.mobile || !category || !formData.city) {
      setMessage({ type: "error", text: "Please fill all required fields", open: true });
      return;
    }

    if (!acceptedPolicy) {
      setMessage({ type: "error", text: "Please accept the Privacy Policy.", open: true });
      return;
    }

    // DEBUG: Check which key is being loaded
    // console.log("Using Razorpay Key:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID); 

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setMessage({ type: "error", text: "Payment Key missing in .env.local", open: true });
      return;
    }

    setLoading(true);

    try {
      const totalAmount = calculateTotal();

      // 2. Create Order (Your Backend)
      // NOTE: Ensure this URL is correct (localhost for dev, actual domain for prod)
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
          payment_type: "ticket",
          username: formData.name,
          email: formData.email,
          mobile: formData.mobile
        })
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error("Failed to create payment order on backend");
      }

      // 3. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount, // Expecting value in Paise (e.g. 500000)
        currency: orderData.order.currency,
        name: "Kalantar Art Foundation",
        description: "Art Festival Ticket Booking",
        order_id: orderData.order.id,

        // Handlers - Payment Success Logic
        handler: async function (response) {
          // console.log("Razorpay Response Success:", response); 
          try {
            // Verify Signature with Backend
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            // If Backend says signature is valid -> Book Ticket
            if (verifyData.success || verifyData.status === 'success') {
              await bookTicket(response);
            } else {
              setLoading(false);
              setMessage({ type: "error", text: "Payment Verification Failed! Please contact support.", open: true });
            }
          } catch (err) {
            // console.error("Verification Error:", err);
            setLoading(false);
            setMessage({ type: "error", text: "Verification API Connection Failed", open: true });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile
        },
        theme: {
          color: "#EC4899"
        },
        // Explicitly handle modal dismissal (User closed popup)
        modal: {
          ondismiss: function () {
            setLoading(false);
            // console.log("Payment modal closed by user");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);

      // Handle Explicit Payment Failures (Bank failed, etc)
      paymentObject.on('payment.failed', function (response) {
        // console.error("Payment Failed Event:", response.error);
        setLoading(false);
        setMessage({
          type: "error",
          text: `Payment Failed: ${response.error.description || "Transaction declined"}`,
          open: true
        });
      });

      paymentObject.open();

    } catch (error) {
      // console.error(error);
      setLoading(false);
      setMessage({ type: "error", text: error.message || "Error initiating payment", open: true });
    }
  };

  // Final Booking Call (Called only after verification)
  const bookTicket = async (razorpayResponse) => {
    try {
      const res = await fetch("/api/art-festival/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          city: formData.city,
          ticket_price: currentUnitCookiePrice,
          number_of_tickets: delegates,
          category: category,
          payment_id: razorpayResponse.razorpay_payment_id
        })
      });

      if (res.ok) {
        // Success Logic
        setMessage({ type: "success", text: "Booking Successful! Ticket confirmed.", open: true });
        setAvailableTickets(prev => Math.max(0, prev - delegates));
        setShowSuccess(true); // <--- Trigger the Thank You Popup
      } else {
        throw new Error("Booking API failed");
      }
    } catch (error) {
      // console.error(error);
      setMessage({ type: "error", text: "Payment verified but final booking API failed. Contact support.", open: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:mt-28 mt-32">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <Snackbar open={message.open} autoHideDuration={6000} onClose={() => setMessage({ ...message, open: false })}>
        <Alert severity={message.type === "success" ? "success" : "error"} onClose={() => setMessage({ ...message, open: false })}>
          {message.text}
        </Alert>
      </Snackbar>

      {/* --- SUCCESS POPUP DIALOG --- */}
      <Dialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 5, px: 3 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <CheckCircle sx={{ fontSize: 80, color: "#10B981" }} />
          </Box>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom sx={{ color: "#1F2937" }}>
            Thank You!
          </Typography>
          <Typography variant="h6" sx={{ color: "#4B5563", mb: 1 }}>
            Booking Successful
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280" }}>
            We will send you the booking details on your mail.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 4 }}>
          <Button
            onClick={() => {
              setShowSuccess(false);
              // Optional: Reset form or reload page
              // window.location.reload(); 
              setFormData({ name: "", org: "", mobile: "", email: "", city: "" });
            }}
            variant="contained"
            sx={{
              bgcolor: "#EC4899",
              "&:hover": { bgcolor: "#DB2777" },
              px: 4,
              py: 1
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- HEADER --- */}
      <header className="relative h-64 text-white overflow-hidden md:px-40">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/headebg.svg')" }} />
        <div className="relative z-10 h-full flex items-center justify-between px-6">
          <div className="hidden md:flex w-32 h-44 items-center relative">
            <Image src="/artlogo.svg" alt="Logo" fill className="object-contain" priority />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-center w-full md:w-auto">
            <h1 className="font-black text-3xl md:text-[48px] leading-none text-white drop-shadow-[0_4px_0_#EC268F]">
              {festivalData.header.title}
            </h1>
            <h2 className="font-bold text-2xl md:text-[48px] leading-none text-white drop-shadow-[0_2px_0_#EC268F]">
              {festivalData.header.subtitle}
            </h2>
          </div>
          <div className="hidden md:flex justify-end p-2 md:p-3 h-36 md:h-40 w-48 md:w-56 bg-[#EB64A3] rounded-xl">
            <div className="border-2 border-[#FFC909] rounded-lg w-full h-full p-2 flex flex-col justify-between">
              <div className="flex items-center h-[80%] w-full gap-1">
                <div className="w-[40%] h-full relative flex items-center justify-center">
                  <Image src="/SEM.svg" alt="sem" fill className="object-contain" />
                </div>
                <div className="w-[50%] flex flex-col justify-center text-center text-white font-semibold leading-none">
                  <span className="text-sm whitespace-nowrap">{festivalData.header.date}</span>
                  <span className="text-4xl">{festivalData.header.year}</span>
                </div>
              </div>
              <div className="text-center text-white font-semibold text-lg whitespace-nowrap h-[20%] flex items-center justify-center">
                {festivalData.header.theme}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="px-4 py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 mb-20">

          {/* 1. About Section */}
          <div className="w-full lg:w-[45%]">
            <div className="relative border-8 border-transparent p-4 h-full shadow-lg bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200"
              style={{ backgroundImage: "url('/baground.png')" }}>
              <div className="relative bg-white rounded-2xl p-6 h-full">
                {festivalData.about.map((paragraph, i) => (
                  <p key={i} className="text-base text-justify leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
                <h2 className=" w-full text-center font-bold text-base">{`The seminar (as part of KALANTAR 2025) will comprise of:`}</h2>
                <ul className="text-base space-y-2 mb-4 my-5">
                  {/* <li>• Two panel discussions will be chaired by:</li>
                  {festivalData.panelists.map((panelist, i) => (
                    <li key={i} className="pl-4 font-semibold">{panelist}</li>
                  ))} */}
                  <li>{`• Two panel discussions`}</li>
                  <li>{`• Annual awards`}</li>
                  <li>{`• Keynote speeches by experts.`}</li>
                </ul>

                <div className="text-sm leading-relaxed font-semibold">

                  <p className=" font-bold text-base">

                    <span className=" ">{`This year’s art festival KALANTAR 2025 has been supported by the`}</span><span className=" text-[#E4097F]"> Ministry of Education, Ministry of Culture, UGC, AICTE, CBSE </span>  various universities and many state governments for larger participation
                  </p>
                </div>
                {/* <p className="text-sm leading-relaxed font-semibold text-pink-600">
                  Supported by: <strong>{festivalData.supporters}</strong>
                </p> */}
              </div>
            </div>
          </div>

          {/* 2. Booking Form */}
          <div className="w-full lg:w-[25%]">
            <Card className="border-none bg-[#FFF8FB] h-full">
              <CardContent className={martel.className} sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight="bold" mb={3} textAlign="left">Book Tickets</Typography>
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} variant="outlined" fullWidth size="small" required />
                  <TextField label="Organization" name="org" value={formData.org} onChange={handleInputChange} variant="outlined" fullWidth size="small" />
                  <TextField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleInputChange} variant="outlined" fullWidth size="small" required />
                  <TextField label="Email ID" name="email" value={formData.email} onChange={handleInputChange} variant="outlined" fullWidth size="small" type="email" required />
                  <TextField label="City" name="city" value={formData.city} onChange={handleInputChange} variant="outlined" fullWidth size="small" required />

                  <FormControl fullWidth size="small" required>
                    <InputLabel>Category</InputLabel>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
                      {["student", "teacher", "professional", "Private"].map(opt => (
                        <MenuItem key={opt} value={opt} sx={{ textTransform: 'capitalize' }}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Delegates Counter */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>Number of Delegates</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton onClick={() => setDelegates(Math.max(1, delegates - 1))} sx={{ bgcolor: "#EC4899", color: "white", "&:hover": { bgcolor: "#DB2777" } }} size="small">
                        <Remove fontSize="small" />
                      </IconButton>
                      <TextField
                        type="number" value={delegates}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value) || 1);
                          if (val <= availableTickets) setDelegates(val);
                        }}
                        size="small" sx={{ width: 50, "& input": { textAlign: "center", p: 0.5 } }}
                      />
                      <IconButton onClick={() => setDelegates(delegates + 1)} disabled={delegates >= availableTickets}
                        sx={{ bgcolor: "#EC4899", color: "white", "&:hover": { bgcolor: "#DB2777" }, "&:disabled": { bgcolor: "#fecdd3" } }} size="small">
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* PRIVACY POLICY CHECKBOX */}
                  <FormControlLabel control={<Checkbox size="small" checked={acceptedPolicy} onChange={(e) => setAcceptedPolicy(e.target.checked)} />}
                    label={<Typography variant="caption" color="text.secondary">I accept the Privacy Policy</Typography>}
                  />

                  <Typography variant="caption" color={availableTickets < 10 ? "error" : "text.secondary"} textAlign="center">
                    {availableTickets > 0 ? `Only ${availableTickets} seats left. Hurry!` : "Sold Out"}
                  </Typography>

                  {/* PAY BUTTON */}
                  <Button variant="contained" fullWidth size="large" onClick={handleBooking}
                    disabled={loading || availableTickets === 0 || !acceptedPolicy}
                    sx={{ background: "linear-gradient(to right, #EC4899, #DB2777)", fontWeight: "bold", textTransform: "none" }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${calculateTotal()} & Book`}
                  </Button>





                  {/* --- ANIMATED DISCOUNT POPUP --- */}
                  <Box sx={{ mt: 2, height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {delegates < 6 ? (
                      <Typography
                        variant="caption"
                        className=" text-sm"
                        sx={{
                          color: "#E11D48", // Red/Pinkish attention color
                          fontWeight: "bold",
                          textAlign: "center",
                          display: "block",
                          // Animation: Gentle pulse to grab attention
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": { transform: "scale(1)", opacity: 0.8 },
                            "50%": { transform: "scale(1.05)", opacity: 1 },
                            "100%": { transform: "scale(1)", opacity: 0.8 },
                          }
                        }}
                      >
                        ✨ 20% Flat Discount on registration fees, if number of participants is 6 or more
                      </Typography>
                    ) : (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#059669", // Green for success
                          fontWeight: "bold",
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          // Animation: A quick pop in when applied
                          animation: "popIn 0.3s ease-out",
                          "@keyframes popIn": {
                            "0%": { transform: "scale(0.5)", opacity: 0 },
                            "100%": { transform: "scale(1)", opacity: 1 },
                          }
                        }}
                      >
                        <CheckCircle fontSize="inherit" /> Bulk Discount Applied! (₹1499/person)
                      </Typography>
                    )}
                  </Box>

                </Box>

                
              </CardContent>
            </Card>
          </div>

          {/* 3. Venue Information */}
          <div className="w-full lg:w-[25%] space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-blue-400">
              <img src="/teradcenter.png" alt="Venue" className="w-full h-64 object-cover" />
              <div className="p-4 text-center">
                <LocationOn sx={{ color: "rgb(236 72 153)", fontSize: 20, mb: 1 }} />
                <p className="font-semibold text-sm text-pink-500 mt-1">Venue</p>
                <p className="text-sm font-medium mt-1">{festivalData.venue.name}</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe title="Map" src={festivalData.venue.mapUrl} width="100%" height="320" style={{ border: 0 }} loading="lazy" className="rounded-b-2xl" />
              <div className="bg-white p-4 border-t flex items-start gap-2">
                <LocationOn sx={{ color: "rgb(236 72 153)", mt: 0.5 }} />
                <div>
                  <p className="font-semibold text-sm">{festivalData.venue.name}</p>
                  <p className="text-xs text-gray-600">{festivalData.venue.address1}</p>
                  <p className="text-xs text-gray-600">{festivalData.venue.address2}</p>
                  <p className="text-xs text-gray-600 mt-1">Open 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- TICKET INCLUDES SECTION --- */}
        <section className="mb-20">
          <div className="bg-[#FFF9FC] py-12 px-6 md:px-12 rounded-lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 inline-flex items-center gap-3 justify-center">
                <span className="w-8 h-8 md:w-10 md:h-10">
                  <Image src="/ticket 1.svg" alt="ticket" width={40} height={40} className="object-contain" />
                </span>
                Your Delegate Ticket Includes
              </h2>
            </div>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-y-10 gap-x-12">
              {festivalData.ticketInclusions.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center justify-start">
                  <div className="shrink-0">
                    <Image src={item.icon} alt="icon" width={48} height={48} className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <p className="text-gray-800 text-lg md:text-xl leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SPEAKERS CAROUSEL --- */}
        <section className="mb-20 overflow-hidden">
          <Typography variant="h3" component="h2" textAlign="center" fontWeight="bold" mb={6}>Our Panelists & Speakers</Typography>
          <div className="relative max-w-6xl mx-auto px-4 md:px-20 h-[600px] md:h-[500px]">
            <div className="relative w-full h-full flex items-center justify-center">
              {speakers.map((speaker, index) => {
                const position = (index - activeSlide + speakers.length) % speakers.length
                let zIndex = 0, scale = 1, opacity = 0.4, translateX = 0, blur = "blur(2px)"

                if (position === 0) { zIndex = 50; scale = 1.1; opacity = 1; translateX = 0; blur = "blur(0px)" }
                else if (position === 1) { zIndex = 40; scale = 0.85; opacity = 0.6; translateX = 280; blur = "blur(1px)" }
                else if (position === speakers.length - 1) { zIndex = 40; scale = 0.85; opacity = 0.6; translateX = -280; blur = "blur(1px)" }
                else if (position === 2) { zIndex = 30; scale = 0.7; opacity = 0.3; translateX = 480; blur = "blur(2px)" }
                else if (position === speakers.length - 2) { zIndex = 30; scale = 0.7; opacity = 0.3; translateX = -480; blur = "blur(2px)" }
                else { zIndex = 0; scale = 0.5; opacity = 0; translateX = position < speakers.length / 2 ? 600 : -600 }
                return (
                  <div key={index} className="absolute transition-all duration-700 ease-in-out cursor-pointer"
                    style={{ zIndex, transform: `translateX(${translateX}px) scale(${scale})`, opacity, filter: blur }}
                    onClick={() => { if (position === 1) nextSlide(); if (position === speakers.length - 1) prevSlide(); }}>
                    <div className="w-64 md:w-80 h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl relative">
                      {position !== 0 && <div className="absolute inset-0 bg-gradient-to-br from-pink-500/70 to-purple-500/70 z-10" />}
                      <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="absolute top-1/2 w-full flex justify-between px-4 z-50 pointer-events-none">
              <IconButton onClick={prevSlide} sx={{ bgcolor: "white", boxShadow: 3, pointerEvents: 'auto', "&:hover": { bgcolor: "rgb(243 244 246)" } }}><ChevronLeft /></IconButton>
              <IconButton onClick={nextSlide} sx={{ bgcolor: "white", boxShadow: 3, pointerEvents: 'auto', "&:hover": { bgcolor: "rgb(243 244 246)" } }}><ChevronRight /></IconButton>
            </div>
          </div>
          <div className="text-center mt-2 max-w-5xl mx-auto px-4">
            <Typography variant="h5" component="h3" fontWeight="bold" sx={{ whiteSpace: "pre-line" }}>
              <span className="text-base">{speakers[activeSlide].name}</span>
            </Typography>
            <div className="flex justify-center items-center gap-2 mt-4">
              {speakers.map((_, index) => (
                <button key={index} onClick={() => setActiveSlide(index)}
                  className={`transition-all duration-300 rounded-full ${index === activeSlide ? "bg-pink-500 w-8 h-3" : "bg-gray-300 w-3 h-3 hover:bg-gray-400"}`} />
              ))}
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="max-w-4xl mx-auto">
          <Typography variant="h3" component="h2" textAlign="center" fontWeight="bold" mb={6}>Frequently Asked Questions</Typography>
          <Box>
            {festivalData.faqs.map((faq, index) => (
              <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleAccordionChange(`panel${index}`)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight="600">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </section>

      </main>
    </div>
  )
}