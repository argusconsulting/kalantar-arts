"use client";

import { useState, useEffect } from 'react';
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Paper,
  TextField,
  Container,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import Image from "next/image";

export default function DonatePage() {
  // --- STATE ---
  const [formData, setFormData] = useState({
    name: '',
    panNumber: '',
    address: '',
    contactNumber: '',
    email: '',
    donationAmount: '',
    customAmount: ''
  });

  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "", open: false });

  const [fieldValidity, setFieldValidity] = useState({
    name: false,
    panNumber: false,
    address: false,
    contactNumber: false,
    email: false,
    donationAmount: false
  });
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  // --- VALIDATION LOGIC ---
  useEffect(() => {
    const isValid = Object.values(fieldValidity).every(Boolean);
    setAllFieldsValid(isValid);
  }, [fieldValidity]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name': return /^[A-Za-z\s]+$/.test(value) && value.length > 2;
      case 'panNumber': return /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(value);
      case 'address': return value.trim().length >= 10;
      case 'contactNumber': return /^[6-9]\d{9}$/.test(value);
      case 'email': return /^\S+@\S+\.\S+$/.test(value);
      case 'donationAmount': return Number(value) > 0;
      default: return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'name') processedValue = value.replace(/[^a-zA-Z\s]/g, '').substring(0, 50);
    if (name === 'panNumber') processedValue = value.toUpperCase().substring(0, 10);
    if (name === 'contactNumber') processedValue = value.replace(/\D/g, '').substring(0, 10);
    
    // Sync custom amount with donation amount if typing in custom field
    if (name === 'customAmount') {
        setFormData(prev => ({ ...prev, customAmount: processedValue, donationAmount: processedValue }));
        const isValid = validateField('donationAmount', processedValue);
        setFieldValidity(prev => ({ ...prev, donationAmount: isValid }));
        return;
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));

    const isValid = validateField(name, processedValue);
    setFieldValidity(prev => ({ ...prev, [name]: isValid }));
  };

  const handleAmountClick = (amount) => {
    setFormData(prev => ({
      ...prev,
      donationAmount: amount.toString(),
      customAmount: amount.toString()
    }));
    setFieldValidity(prev => ({ ...prev, donationAmount: true }));
  };

  // --- PAYMENT FLOW ---
  const handleDonate = async (e) => {
    e.preventDefault();
    if (!allFieldsValid) return;

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        setMessage({ type: "error", text: "Configuration Error: Missing Payment Key", open: true });
        return;
    }

    setLoading(true);

    try {
      // 1. Create Order
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_RAZORPAY_order_URI}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.JWT_SECRET}` },
        body: JSON.stringify({
          amount: formData.donationAmount, // Backend should handle conversion to paise if needed, or send in paise
          currency: "INR",
          payment_type: "donation", // Trigger specific donation logic
          username: formData.name,
          email: formData.email,
          mobile: formData.contactNumber,
          pan: formData.panNumber // Useful for 80G receipts
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error("Failed to generate donation order");

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Kalantar Art Foundation",
        description: "Donation for Art & Social Cause",
        order_id: orderData.order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contactNumber
        },
        theme: { color: "#E84691" },
        
        // 3. Verify Payment
        handler: async function (response) {
            try {
                const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_RAZORPAY_verify_URI}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" ,Authorization: `Bearer ${process.env.JWT_SECRET}`},
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })
                });

                const verifyData = await verifyRes.json();

                if (verifyData.success) {
                    await saveDonationRecord(response.razorpay_payment_id);
                } else {
                    setLoading(false);
                    setMessage({ type: "error", text: "Payment Verification Failed", open: true });
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
                setMessage({ type: "error", text: "Error verifying payment", open: true });
            }
        },
        modal: {
            ondismiss: function() {
                setLoading(false);
            }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
          setLoading(false);
          setMessage({ type: "error", text: response.error.description, open: true });
      });
      paymentObject.open();

    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage({ type: "error", text: error.message || "Something went wrong", open: true });
    }
  };

  // 4. Save to Database (After Verification)
  const saveDonationRecord = async (paymentId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donation_submissions`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`, // Add if your API requires auth for public posts
            },
            body: JSON.stringify({
                name: formData.name,
                pan_number: formData.panNumber,
                address: formData.address,
                contact_number: formData.contactNumber,
                email: formData.email,
                donation_amount: formData.donationAmount,
                payment_method: "Razorpay Gateway",
                transaction_id: paymentId,
                status: "completed"
            }),
        });

        if (response.ok) {
            setLoading(false);
            setShowThankYou(true);
        } else {
            throw new Error("Failed to save donation record");
        }
    } catch (error) {
        console.error(error);
        setLoading(false);
        setMessage({ type: "warning", text: "Donation received, but failed to save record. Contact support.", open: true });
    }
  };

  // --- ANIMATION COMPONENT ---
  const FlowerDropAnimation = () => (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * window.innerWidth, rotate: Math.random() * 360 }}
          animate={{ 
            y: window.innerHeight + 50,
            transition: { duration: 3 + Math.random() * 3, repeat: Infinity, ease: "linear" }
          }}
          style={{ position: 'absolute', color: '#E84691', fontSize: '24px' }}
        >
          <LocalFloristIcon />
        </motion.div>
      ))}
    </Box>
  );

  if (showThankYou) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fffafc]">
            <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
                <Paper elevation={3} sx={{ p: 6, borderRadius: 4 }}>
                    <Box className='flex justify-center items-center mb-6'>
                        <Image src="/Logos/Kalantar-logo.svg" alt="Logo" width={120} height={120} />
                    </Box>
                    <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Typography variant="h4" gutterBottom sx={{ color: '#E84691', fontWeight: 'bold' }}>
                        Thank You!
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Dear {formData.name},
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
                        We have successfully received your donation of <strong>₹{formData.donationAmount}</strong>. 
                        Your certificate under Section-80G will be sent to your registered email ID ({formData.email}) shortly.
                    </Typography>
                    <Button variant="outlined" onClick={() => window.location.href='/'} sx={{ color: '#E84691', borderColor: '#E84691' }}>
                        Return to Home
                    </Button>
                </Paper>
                <FlowerDropAnimation />
            </Container>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12  md:mt-28 mt-32">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <Snackbar open={message.open} autoHideDuration={6000} onClose={() => setMessage({ ...message, open: false })}>
        <Alert severity={message.type === "success" ? "success" : "error"}>{message.text}</Alert>
      </Snackbar>

      <Container maxWidth="md">
        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            
            {/* Header */}
            <Box sx={{ backgroundColor: '#E84691', p: 4, color: 'white', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold">Support Our Cause</Typography>
                <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
                    Your contribution helps us bring art to the underprivileged.
                </Typography>
            </Box>

            <Box sx={{ p: { xs: 3, md: 6 } }}>
                {/* Introduction Text */}
                <Paper variant="outlined" sx={{ p: 3, mb: 4, backgroundColor: "#fffafc", borderColor: "#fce4ec" }}>
                    <Typography variant="h6" gutterBottom sx={{ color: "#E84691" }}>
                        Welcome Dear Donor,
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.7 }}>
                        We are committed to bring a huge social revolution by way of practicing art. 
                        We are working with the underprivileged community, prisoners, orphans, and construction sites.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 2, color: "#E84691", fontWeight: "bold", textAlign: 'center' }}>
                        (ALL DONATIONS ARE ELIGIBLE FOR TAX EXEMPTION UNDER SEC-80G)
                    </Typography>
                </Paper>

                <form onSubmit={handleDonate}>
                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={3}>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                            InputProps={{
                                endAdornment: fieldValidity.name && <InputAdornment position="end"><CheckCircleIcon color="success" /></InputAdornment>
                            }}
                            helperText={!fieldValidity.name && formData.name && "Min 3 chars"}
                        />
                        <TextField
                            label="Email ID"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            fullWidth
                            InputProps={{
                                endAdornment: fieldValidity.email && <InputAdornment position="end"><CheckCircleIcon color="success" /></InputAdornment>
                            }}
                            helperText={!fieldValidity.email && formData.email && "Valid email required"}
                        />
                        <TextField
                            label="Contact Number"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                            fullWidth
                            InputProps={{
                                endAdornment: fieldValidity.contactNumber && <InputAdornment position="end"><CheckCircleIcon color="success" /></InputAdornment>
                            }}
                            helperText={!fieldValidity.contactNumber && formData.contactNumber && "10 digits required"}
                        />
                        <TextField
                            label="PAN Number (For 80G)"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleChange}
                            required
                            fullWidth
                            InputProps={{
                                endAdornment: fieldValidity.panNumber && <InputAdornment position="end"><CheckCircleIcon color="success" /></InputAdornment>
                            }}
                            helperText={!fieldValidity.panNumber && formData.panNumber && "Format: ABCDE1234F"}
                        />
                    </Box>
                    
                    <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        fullWidth
                        multiline
                        rows={2}
                        margin="normal"
                        InputProps={{
                            endAdornment: fieldValidity.address && <InputAdornment position="end"><CheckCircleIcon color="success" /></InputAdornment>
                        }}
                        helperText={!fieldValidity.address && formData.address && "Min 10 chars required"}
                    />

                    <Box mt={4}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Select Donation Amount:</Typography>
                        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                            {[1100, 2100, 5100, 11000].map(amount => (
                                <Button
                                    key={amount}
                                    variant={formData.donationAmount === amount.toString() ? 'contained' : 'outlined'}
                                    onClick={() => handleAmountClick(amount)}
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1,
                                        borderColor: '#E84691',
                                        color: formData.donationAmount === amount.toString() ? 'white' : '#E84691',
                                        backgroundColor: formData.donationAmount === amount.toString() ? '#E84691' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: formData.donationAmount === amount.toString() ? '#d43d81' : '#fce4ec',
                                            borderColor: '#E84691'
                                        }
                                    }}
                                >
                                    ₹{amount.toLocaleString()}
                                </Button>
                            ))}
                        </Box>
                        <TextField
                            fullWidth
                            label="Or enter custom amount"
                            name="customAmount"
                            type="number"
                            value={formData.customAmount}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                    </Box>

                    <Box mt={5} textAlign="center">
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={!allFieldsValid || loading}
                            sx={{ 
                                px: 8, 
                                py: 1.5, 
                                fontSize: '1.1rem',
                                borderRadius: 50,
                                backgroundColor: '#E84691',
                                '&:hover': { backgroundColor: '#d43d81' },
                                '&:disabled': { backgroundColor: '#ccc' }
                            }}
                        >
                            {loading ? <CircularProgress size={26} color="inherit" /> : `Donate ₹${formData.donationAmount || '0'} Now`}
                        </Button>
                        <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 2 }}>
                            Secure payment via Razorpay
                        </Typography>
                    </Box>
                </form>
            </Box>
        </Paper>
      </Container>
    </div>
  );
}