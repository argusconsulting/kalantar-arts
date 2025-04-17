"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import Image from "next/image";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ImageUpload from "../Components/ImageUpload";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState({
    data: false,
    upi: false,
    bank: false,
    donation: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState({
    upiId: '',
    qrCode: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifsc: '',
      branch: ''
    }
  });

  useEffect(() => {
    fetchData();
    fetchPaymentSettings();
  }, []);

  const fetchData = async () => {
    setLoading(prev => ({...prev, data: true}));
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donation_submissions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch donations");
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch donations");
    } finally {
      setLoading(prev => ({...prev, data: false}));
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment_settings/1`, {
        headers: {
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
      });
      if (response.ok) {
        const settings = await response.json();
        setPaymentSettings({
          upiId: settings.upi_id || '',
          qrCode: settings.qr_code || '',
          bankDetails: settings.bank_details ? JSON.parse(settings.bank_details) : {
            accountName: '',
            accountNumber: '',
            bankName: '',
            ifsc: '',
            branch: ''
          }
        });
      }
    } catch (err) {
      console.error("Failed to fetch payment settings:", err);
    }
  };

  const handleUpdateUPISettings = async () => {
    setLoading(prev => ({...prev, upi: true}));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment_settings/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
        body: JSON.stringify({
          upi_id: paymentSettings.upiId,
          qr_code: paymentSettings.qrCode
        }),
      });

      if (!response.ok) throw new Error("Failed to update UPI settings");
      
      setSuccess("UPI settings updated successfully");
      fetchPaymentSettings();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update UPI settings");
    } finally {
      setLoading(prev => ({...prev, upi: false}));
    }
  };

  const handleUpdateBankSettings = async () => {
    setLoading(prev => ({...prev, bank: true}));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment_settings/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
        body: JSON.stringify({
          bank_details: JSON.stringify(paymentSettings.bankDetails)
        }),
      });

      if (!response.ok) throw new Error("Failed to update bank settings");
      
      setSuccess("Bank settings updated successfully");
      fetchPaymentSettings();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update bank settings");
    } finally {
      setLoading(prev => ({...prev, bank: false}));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donation_submissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete donation");
      
      setSuccess("Donation deleted successfully");
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete donation");
    }
  };

  const handleUpdateDonation = async () => {
    if (!currentDonation) return;
    
    setLoading(prev => ({...prev, donation: true}));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donation_submissions/${currentDonation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
        },
        body: JSON.stringify(currentDonation),
      });

      if (!response.ok) throw new Error("Failed to update donation");
      
      setSuccess("Donation updated successfully");
      setOpenEdit(false);
      fetchData();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update donation");
    } finally {
      setLoading(prev => ({...prev, donation: false}));
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6">
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Paper elevation={3} className="p-4">
          <Typography variant="h6" gutterBottom>
            UPI Payment Settings
          </Typography>
          <TextField
            fullWidth
            label="UPI ID"
            value={paymentSettings.upiId}
            onChange={(e) => setPaymentSettings({...paymentSettings, upiId: e.target.value})}
            margin="normal"
          />
          <div className="mt-4">
            <Typography variant="subtitle1">QR Code</Typography>
            <ImageUpload 
              multiple={false}
              onUpload={(img) => setPaymentSettings({...paymentSettings, qrCode: img})}
            />
            {paymentSettings.qrCode && (
              <Image 
                src={`${process.env.NEXT_PUBLIC_Files_URL}/${paymentSettings.qrCode}`} 
                alt="QR Code" 
                width={150} 
                height={150} 
                className="mt-2"
              />
            )}
          </div>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateUPISettings}
            className="mt-4"
            disabled={loading.upi}
          >
            {loading.upi ? <CircularProgress size={24} /> : 'Save UPI Settings'}
          </Button>
        </Paper>

        <Paper elevation={3} className="p-4">
          <Typography variant="h6" gutterBottom>
            Bank Transfer Settings
          </Typography>
          <TextField
            fullWidth
            label="Account Name"
            value={paymentSettings.bankDetails?.accountName || ''}
            onChange={(e) => setPaymentSettings({
              ...paymentSettings, 
              bankDetails: {
                ...paymentSettings.bankDetails,
                accountName: e.target.value
              }
            })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Account Number"
            value={paymentSettings.bankDetails?.accountNumber || ''}
            onChange={(e) => setPaymentSettings({
              ...paymentSettings, 
              bankDetails: {
                ...paymentSettings.bankDetails,
                accountNumber: e.target.value
              }
            })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Bank Name"
            value={paymentSettings.bankDetails?.bankName || ''}
            onChange={(e) => setPaymentSettings({
              ...paymentSettings, 
              bankDetails: {
                ...paymentSettings.bankDetails,
                bankName: e.target.value
              }
            })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="IFSC Code"
            value={paymentSettings.bankDetails?.ifsc || ''}
            onChange={(e) => setPaymentSettings({
              ...paymentSettings, 
              bankDetails: {
                ...paymentSettings.bankDetails,
                ifsc: e.target.value
              }
            })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Branch"
            value={paymentSettings.bankDetails?.branch || ''}
            onChange={(e) => setPaymentSettings({
              ...paymentSettings, 
              bankDetails: {
                ...paymentSettings.bankDetails,
                branch: e.target.value
              }
            })}
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateBankSettings}
            className="mt-4"
            disabled={loading.bank}
          >
            {loading.bank ? <CircularProgress size={24} /> : 'Save Bank Settings'}
          </Button>
        </Paper>
      </div>

      <Typography variant="h5" gutterBottom>
        Donation Submissions
      </Typography>

      {loading.data ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>PAN</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Receipt</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{donation.name}</TableCell>
                  <TableCell>{donation.pan_number}</TableCell>
                  <TableCell>₹{donation.donation_amount}</TableCell>
                  <TableCell>{donation.payment_method}</TableCell>
                  <TableCell>{donation.status || 'pending'}</TableCell>
                  <TableCell>{formatDate(donation.created_at)}</TableCell>
                  <TableCell>
                    {donation.PaymentProf && (
                      <Image 
                        src={`${process.env.NEXT_PUBLIC_Files_URL}/${donation.PaymentProf}`} 
                        alt="Receipt" 
                        width={50} 
                        height={50} 
                        className="cursor-pointer"
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_Files_URL}/${donation.PaymentProf}`, '_blank')}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setCurrentDonation(donation);
                      setOpenEdit(true);
                    }}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(donation.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Donation
          <IconButton onClick={() => setOpenEdit(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {currentDonation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Name"
                fullWidth
                value={currentDonation.name}
                onChange={(e) => setCurrentDonation({...currentDonation, name: e.target.value})}
                margin="normal"
              />
              <TextField
                label="PAN Number"
                fullWidth
                value={currentDonation.pan_number}
                onChange={(e) => setCurrentDonation({...currentDonation, pan_number: e.target.value})}
                margin="normal"
              />
              <TextField
                label="Email"
                fullWidth
                value={currentDonation.email}
                onChange={(e) => setCurrentDonation({...currentDonation, email: e.target.value})}
                margin="normal"
              />
              <TextField
                label="Contact Number"
                fullWidth
                value={currentDonation.contact_number}
                onChange={(e) => setCurrentDonation({...currentDonation, contact_number: e.target.value})}
                margin="normal"
              />
              <TextField
                label="Amount"
                fullWidth
                type="number"
                value={currentDonation.donation_amount}
                onChange={(e) => setCurrentDonation({...currentDonation, donation_amount: e.target.value})}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={currentDonation.payment_method || ''}
                  onChange={(e) => setCurrentDonation({...currentDonation, payment_method: e.target.value})}
                  label="Payment Method"
                >
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" className="md:col-span-2">
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentDonation.status || 'pending'}
                  onChange={(e) => setCurrentDonation({...currentDonation, status: e.target.value})}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <div className="md:col-span-2">
                <Typography variant="subtitle1">Receipt Image</Typography>
                {currentDonation.receipt_image && (
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_Files_URL}/${currentDonation.receipt_image}`} 
                    alt="Receipt" 
                    width={200} 
                    height={150} 
                    className="mb-2"
                  />
                )}
                <ImageUpload 
                  multiple={false}
                  onUpload={(img) => setCurrentDonation({...currentDonation, receipt_image: img})}
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateDonation} 
            variant="contained" 
            color="primary"
            disabled={loading.donation}
          >
            {loading.donation ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;