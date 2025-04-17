"use client";

import { IoIosArrowRoundForward } from "react-icons/io";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  TextField,
  Radio,
  Container,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  Typography,
  Box,
  Divider,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import Image from "next/image";
import ImageUpload from "@/app/KL-Admin/Components/ImageUpload";

const DonatePopup = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    panNumber: '',
    address: '',
    contactNumber: '',
    email: '',
    donationAmount: '',
    customAmount: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [paymentProofData, setPaymentProofData] = useState("");
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [fieldValidity, setFieldValidity] = useState({
    name: false,
    panNumber: false,
    address: false,
    contactNumber: false,
    email: false,
    donationAmount: false
  });
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        panNumber: "",
        address: "",
        contactNumber: "",
        email: "",
        donationAmount: "",
        customAmount: "",
      });
      setFieldValidity({
        name: false,
        panNumber: false,
        address: false,
        contactNumber: false,
        email: false,
        donationAmount: false
      });
      setPaymentMethod('');
      setFormSubmitted(false);
      setPaymentProofData("");
    }
  }, [open]);

  // Check if all fields are valid
  useEffect(() => {
    const isValid = Object.values(fieldValidity).every(Boolean);
    setAllFieldsValid(isValid);
  }, [fieldValidity]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length >= 3;
      case 'panNumber':
        return /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(value);
      case 'address':
        return value.trim().length >= 10;
      case 'contactNumber':
        return /^\d{10}$/.test(value);
      case 'email':
        return /^\S+@\S+\.\S+$/.test(value);
      case 'donationAmount':
        return value > 0;
      default:
        return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'panNumber') {
      processedValue = value.toUpperCase();
    }
    
    if (name === 'contactNumber') {
      processedValue = value.replace(/\D/g, '').substring(0, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    const validationValue = name === 'panNumber' ? value : processedValue;
    const isValid = validateField(name, validationValue);
    setFieldValidity(prev => ({
      ...prev,
      [name]: isValid
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allFieldsValid) return;
    
    setIsSubmitting(true);
    
    const donationData = {
      name: formData.name,
      pan_number: formData.panNumber.toUpperCase(),
      address: formData.address,
      contact_number: formData.contactNumber,
      email: formData.email,
      donation_amount: formData.donationAmount,
      payment_method: paymentMethod,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donation_submissions`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
        body: JSON.stringify(donationData),
      });

      if (response.ok) {
        setFormSubmitted(true);
        sessionStorage.setItem("pan_number", formData.panNumber.toUpperCase());
      } else {
        throw new Error('Failed to submit donation');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error processing your donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleAmountClick = (amount) => {
    setFormData(prev => ({
      ...prev,
      donationAmount: amount.toString(),
      customAmount: amount.toString()
    }));
    setFieldValidity(prev => ({
      ...prev,
      donationAmount: true
    }));
  };

  const handleReset = () => {
    setFormSubmitted(false);
    setPaymentMethod('');
  };

  const handlePaymentComplete = useCallback(async () => {
    try {
      const panNumber = sessionStorage.getItem("pan_number");
      if (!panNumber) throw new Error("PAN number not found in session");
  
      const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donation_submissions?pan_number=${panNumber}`, {
        headers: {
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
      });
  
      if (!fetchResponse.ok) throw new Error("Failed to fetch donation records");
  
      const donations = await fetchResponse.json();
      if (!donations || donations.length === 0) throw new Error("No donation records found");
  
      const latestDonation = donations[donations.length - 1];
      const latestDonationId = latestDonation.id;
  
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donation_submissions/${latestDonationId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          PaymentProf: paymentProofData,
          status: 'completed'
        }),
      });
  
      if (!updateResponse.ok) throw new Error('Failed to update payment method');
  
      setShowReceiptUpload(false);
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        onClose();
        resetForm();
      }, 3000);
    } catch (error) {
      console.error('Error updating payment method:', error);
      alert('There was an error updating your payment method. Please contact support.');
    }
  }, [paymentMethod, onClose, paymentProofData]);

  // Auto-submit when payment proof is uploaded
  useEffect(() => {
    if (paymentProofData && showReceiptUpload) {
      handlePaymentComplete();
    }
  }, [paymentProofData, showReceiptUpload, handlePaymentComplete]);

  const resetForm = () => {
    setFormData({
      name: '',
      panNumber: '',
      address: '',
      contactNumber: '',
      email: '',
      donationAmount: '',
      customAmount: ''
    });
    setFieldValidity({
      name: false,
      panNumber: false,
      address: false,
      contactNumber: false,
      email: false,
      donationAmount: false
    });
    setFormSubmitted(false);
    setPaymentMethod('');
    setPaymentProofData("");
  };

  const FlowerDropAnimation = () => {
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: -50,
              x: Math.random() * window.innerWidth,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: window.innerHeight + 50,
              transition: {
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            style={{
              position: 'absolute',
              color: '#E84691',
              fontSize: '24px'
            }}
          >
            <LocalFloristIcon />
          </motion.div>
        ))}
      </Box>
    );
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#E84691', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
          <span>Donate Now</span>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {!formSubmitted ? (
            <form onSubmit={handleSubmit}>
              <Container maxWidth="md" sx={{ py: 6 }}>
                <Paper elevation={3} sx={{ p: 4, backgroundColor: "#fffafc", borderLeft: "6px solid #E84691" }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: "#E84691" }}>
                    Welcome Dear Donor,
                  </Typography>
                  <Typography variant="body1" align="justify" sx={{ color: "#444", lineHeight: 1.8 }}>
                    First of all, we thank you for your noble thought towards supporting Kalantar&apos;s social cause.
                    <br /><br />
                    We are committed to bring a huge social revolution by way of practicing art. We are largely working with the underprivileged community, the prisoners, the orphans and construction sites under our free art education programs.
                    <br /><br />
                    Our 1st (Model) Art Village is going to be a solution to many social and mental problems, thus being a trendsetter for many such villages across the country.
                  </Typography>
                </Paper>

                <Box mt={3}>
                  <Typography variant="body1" align="center" sx={{ color: "#E84691", fontWeight: "bold", mt: 3 }}>
                    (ALL DONATIONS MADE TO KALANTAR ART FOUNDATION ARE ELIGIBLE FOR TAX EXEMPTION UNDER SEC-80G)
                  </Typography>
                </Box>
              </Container>
              
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: fieldValidity.name && (
                    <InputAdornment position="end">
                      <CheckCircleIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                helperText={!fieldValidity.name && formData.name && "Minimum 3 characters required"}
              />
              
              <TextField
                fullWidth
                margin="normal"
                label="PAN Number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: fieldValidity.panNumber && (
                    <InputAdornment position="end">
                      <CheckCircleIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                helperText={!fieldValidity.panNumber && formData.panNumber && "Format: ABCDE1234F"}
              />
              
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
                required
                InputProps={{
                  endAdornment: fieldValidity.address && (
                    <InputAdornment position="end">
                      <CheckCircleIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                helperText={!fieldValidity.address && formData.address && "Minimum 10 characters required"}
              />
              
              <TextField
                fullWidth
                margin="normal"
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: fieldValidity.contactNumber && (
                    <InputAdornment position="end">
                      <CheckCircleIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                helperText={!fieldValidity.contactNumber && formData.contactNumber && "10 digits required"}
              />
              
              <TextField
                fullWidth
                margin="normal"
                label="Email ID"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: fieldValidity.email && (
                    <InputAdornment position="end">
                      <CheckCircleIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                helperText={!fieldValidity.email && formData.email && "Valid email required"}
              />
              
              <Box mt={2} mb={2}>
                <Typography variant="subtitle1">Donation Amount:</Typography>
                <Box display="flex" gap={1} mt={1} mb={1}>
                  {[1100, 2100, 5100].map(amount => (
                    <Button
                      key={amount}
                      variant={formData.donationAmount === amount.toString() ? 'contained' : 'outlined'}
                      onClick={() => handleAmountClick(amount)}
                      sx={{ 
                        backgroundColor: formData.donationAmount === amount.toString() ? '#E84691' : 'inherit',
                        '&:hover': {
                          backgroundColor: formData.donationAmount === amount.toString() ? '#d43d81' : '#f5f5f5'
                        }
                      }}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </Box>
                <TextField
                  fullWidth
                  label="Or enter custom amount"
                  name="customAmount"
                  type="number"
                  value={formData.customAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      customAmount: value,
                      donationAmount: value
                    }));
                    setFieldValidity(prev => ({
                      ...prev,
                      donationAmount: value > 0
                    }));
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    endAdornment: fieldValidity.donationAmount && (
                      <InputAdornment position="end">
                        <CheckCircleIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                  helperText={!fieldValidity.donationAmount && formData.donationAmount && "Amount must be greater than 0"}
                />
              </Box>
              
              <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ 
                    backgroundColor: allFieldsValid ? '#E84691' : '#cccccc',
                    '&:hover': { 
                      backgroundColor: allFieldsValid ? '#d43d81' : '#cccccc' 
                    }
                  }}
                  disabled={!allFieldsValid || isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </DialogActions>
            </form>
          ) : (
            <Box>
              {!paymentMethod ? (
                <Box>
                  <Typography variant="h6" gutterBottom textAlign="center">
                    Select Payment Method
                  </Typography>
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                      aria-label="payment-method"
                      name="payment-method"
                      value={paymentMethod}
                      onChange={handlePaymentMethodChange}
                    >
                      <FormControlLabel
                        value="upi"
                        control={<Radio color="primary" />}
                        label="UPI Payment"
                      />
                      <FormControlLabel
                        value="bank"
                        control={<Radio color="primary" />}
                        label="Bank Transfer"
                      />
                    </RadioGroup>
                  </FormControl>
                  
                  <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      sx={{ color: '#E84691', borderColor: '#E84691' }}
                    >
                      Back
                    </Button>
                  </DialogActions>
                </Box>
              ) : paymentMethod === 'upi' ? (
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    UPI Payment
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Scan the QR code below to make payment via UPI
                  </Typography>
                  <Box mt={2} mb={2} p={2} border="1px dashed #ccc" className="flex justify-center items-center" borderRadius={2}>
                    <Typography variant="body2" className="flex justify-center items-center w-96" color="textSecondary">
                      <Image src="/QR.png" alt="UPI QR Code" width={500} height={500} />
                    </Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    UPI ID: 7982719972@okbizaxis
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom textAlign="center">
                    Bank Transfer Details
                  </Typography>
                  <Box mt={2} mb={2} p={2} border="1px solid #eee" borderRadius={2}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Account Name:</strong> KALANTAR ART FOUNDATION
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Account Number:</strong> 52990200001323
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Bank Name:</strong> Bank of Baroda
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>IFSC Code:</strong> BARB0BHANGE
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Branch:</strong> Bhangel, Noida
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Please use the reference &quot;DONATION&quot; when making the transfer.
                  </Typography>
                </Box>
              )}
              
              {paymentMethod && (
                <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{ color: '#E84691', borderColor: '#E84691' }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setShowReceiptUpload(true)}
                    sx={{ backgroundColor: '#E84691', '&:hover': { backgroundColor: '#d43d81' } }}
                  >
                    Attach Payment Receipt
                  </Button>
                </DialogActions>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Upload Dialog */}
      <Dialog open={showReceiptUpload} onClose={() => setShowReceiptUpload(false)} maxWidth="sm">
        <DialogTitle>
          Upload Payment Receipt
          <IconButton onClick={() => setShowReceiptUpload(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            Please upload a clear image of your payment receipt for verification.
          </Typography>
          <Box mt={3}>
            <ImageUpload
              multiple={false}
              onUpload={setPaymentProofData}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReceiptUpload(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!paymentProofData}
            onClick={handlePaymentComplete}
            sx={{ backgroundColor: '#E84691', '&:hover': { backgroundColor: '#d43d81' } }}
          >
            {paymentProofData ? 'Submit Receipt' : 'Upload Receipt'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thank You Dialog */}
      <AnimatePresence>
        {showThankYou && (
          <Dialog open={showThankYou} onClose={() => setShowThankYou(false)} maxWidth="xs" fullWidth>
            <DialogContent sx={{ textAlign: 'center', py: 4 }}>
              <Box className='flex justify-center items-center'>
                <Image src="/Logos/Kalantar-logo.svg" alt="Logo" width={100} height={100}/>
              </Box>
              <Typography variant="body1" sx={{ my: 3 }}>
              Thank you for donating to Kalantar Art Foundation. Your certificate
under Section-80G will be sent on your registered email ID and mobile
number soon.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
              In case we have not received the payment, then we will inform you and request for payment receipt
              </Typography>
              <LocalFloristIcon sx={{ fontSize: 60, color: '#E84691', mb: 2 }} />
              <FlowerDropAnimation />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

const Donate = () => {
  const pathname = usePathname();
  const [openPopup, setOpenPopup] = useState(false);

  if (pathname.startsWith("/KL-Admin")) return null;

  return (
    <>
      <motion.button
        animate={{
          y: [0, -10, 0],
          transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        }}
        className="fixed bottom-10 right-6 z-50 flex items-center justify-center h-14 w-40 max-md:h-12 max-md:w-28 rounded-full text-xl font-semibold text-white bg-[#E4097F] hover:bg-pink-400 shadow-lg transition-all"
        onClick={() => setOpenPopup(true)}
      >
        Donate <IoIosArrowRoundForward size={30} className="ml-1" />
      </motion.button>
      
      <DonatePopup open={openPopup} onClose={() => setOpenPopup(false)} />
    </>
  );
};

export default Donate;