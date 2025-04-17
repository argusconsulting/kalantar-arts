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
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";

const FooterLinksPage = () => {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [type, setType] = useState("quick");
    const [data, setData] = useState(null); // null initially to track loading state
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/FooterLinks`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.JWT_SECRET}`,
                },
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(Array.isArray(result) ? result : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to fetch footer links");
            setData([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!name?.trim()) {
            setError("Name is required");
            return;
        }
        
        if (!link?.trim()) {
            setError("Link is required");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const method = editId ? "PUT" : "POST";
            const url = editId
                ? `${process.env.NEXT_PUBLIC_API_URL}/FooterLinks/${editId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/FooterLinks`;

            const payload = { 
                name: name.trim(), 
                link: link.trim(), 
                type: type || "quick" // Default to quick if null
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.JWT_SECRET}`,
                },
                cache: "no-store",
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Request failed");
            }

            setSuccess(editId ? "Footer link updated successfully!" : "Footer link created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.message || "Failed to process request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id || !confirm("Are you sure you want to delete this item?")) return;

        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/FooterLinks/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.JWT_SECRET}`,
                },
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setSuccess("Footer link deleted successfully!");
            fetchData();
        } catch (err) {
            console.error("Delete error:", err);
            setError(err.message || "Failed to delete. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        if (!item) return;
        
        setEditId(item.id || null);
        setName(item.name || "");
        setLink(item.link || "");
        setType(item.type || "quick");
        setOpen(true);
    };

    const resetForm = () => {
        setName("");
        setLink("");
        setType("quick");
        setEditId(null);
        setError(null);
    };

    const handleCloseSnackbar = () => {
        setSuccess(null);
        setError(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) 
                ? "Invalid date" 
                : date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
        } catch {
            return "Invalid date";
        }
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

            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setOpen(true)}
                disabled={loading}
            >
                Create Footer Link
            </Button>

            <Dialog open={open} onClose={() => !loading && setOpen(false)}>
                <DialogTitle>{editId ? "Edit Footer Link" : "Create Footer Link"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="dense"
                        required
                        disabled={loading}
                        error={!!error && !name?.trim()}
                    />
                    <TextField
                        fullWidth
                        label="Link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        margin="dense"
                        required
                        disabled={loading}
                        error={!!error && !link?.trim()}
                    />
                    <FormControl fullWidth margin="dense" disabled={loading}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <MenuItem value="quick">Quick Link</MenuItem>
                            <MenuItem value="related">Related Link</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => !loading && setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : editId ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            {loading && !data ? (
                <div className="flex justify-center mt-6">
                    <CircularProgress />
                </div>
            ) : error && !data ? (
                <Alert severity="error" className="mt-6">
                    {error}
                </Alert>
            ) : (
                <TableContainer component={Paper} className="mt-6">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Creation Date</TableCell>
                                <TableCell>Update Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.length ? (
                                data.map((item) => (
                                    <TableRow key={item.id || Math.random()}>
                                        <TableCell>{item.name || "N/A"}</TableCell>
                                        <TableCell>{item.link || "N/A"}</TableCell>
                                        <TableCell>{item.type === "quick" ? "Quick Link" : "Related Link"}</TableCell>
                                        <TableCell>{formatDate(item.creation_date)}</TableCell>
                                        <TableCell>{formatDate(item.update_date)}</TableCell>
                                        <TableCell className="flex gap-x-4">
                                            <Button 
                                                size="small" 
                                                onClick={() => handleEdit(item)} 
                                                variant="contained" 
                                                color="secondary"
                                                disabled={loading}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                size="small" 
                                                onClick={() => handleDelete(item.id)} 
                                                variant="contained" 
                                                color="error"
                                                disabled={loading}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No footer links found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default FooterLinksPage;