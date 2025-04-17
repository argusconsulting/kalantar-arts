"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../Components/ImageUpload";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, CircularProgress } from "@mui/material";
import Image from "next/image";

const Page = () => {
    const [dateMonth, setDateMonth] = useState("");
    const [dateDay, setDateDay] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [link, setLink] = useState("");
    const [data, setData] = useState([]);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Initiatives`, {
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
            setError(err.message || "Failed to fetch initiatives");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!dateMonth || !dateDay || !title || !description || !image) {
            setError("Please fill all required fields");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const method = editId ? "PUT" : "POST";
            const url = editId
                ? `${process.env.NEXT_PUBLIC_API_URL}/Initiatives/${editId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/Initiatives`;

            const payload = {
                date_month: dateMonth,
                date_day: dateDay,
                title,
                description,
                image,
                link: link || "#"
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

            setSuccess(editId ? "Initiative updated successfully!" : "Initiative created successfully!");
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Initiatives/${id}`, {
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

            setSuccess("Initiative deleted successfully!");
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
        setDateMonth(item.date_month || item.date?.month || "");
        setDateDay(item.date_day || item.date?.day || "");
        setTitle(item.title || "");
        setDescription(item.description || "");
        setImage(item.image || "");
        setLink(item.link || "");
        setOpen(true);
    };

    const resetForm = () => {
        setDateMonth("");
        setDateDay("");
        setTitle("");
        setDescription("");
        setImage("");
        setLink("");
        setEditId(null);
        setError(null);
    };

    const handleCloseSnackbar = () => {
        setSuccess(null);
        setError(null);
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
                Create Initiative
            </Button>

            <Dialog open={open} onClose={() => !loading && setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{editId ? "Edit Initiative" : "Create Initiative"}</DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <TextField 
                            fullWidth 
                            label="Date Month (e.g., Jan)" 
                            value={dateMonth} 
                            onChange={(e) => setDateMonth(e.target.value)} 
                            margin="dense" 
                            required 
                            disabled={loading}
                        />
                        <TextField 
                            fullWidth 
                            label="Date Day (e.g., 26/27)" 
                            value={dateDay} 
                            onChange={(e) => setDateDay(e.target.value)} 
                            margin="dense" 
                            required 
                            disabled={loading}
                        />
                        <TextField 
                            fullWidth 
                            label="Title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            margin="dense" 
                            required 
                            disabled={loading}
                            className="md:col-span-2"
                        />
                        <TextField 
                            fullWidth 
                            label="Description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            margin="dense" 
                            required 
                            multiline
                            rows={4}
                            disabled={loading}
                            className="md:col-span-2"
                        />
                        <TextField 
                            fullWidth 
                            label="Link" 
                            value={link} 
                            onChange={(e) => setLink(e.target.value)} 
                            margin="dense" 
                            disabled={loading}
                            className="md:col-span-2"
                        />
                        {image && (
                            <div className="md:col-span-2 flex items-center gap-4">
                                <Image
                                    width={150}
                                    height={100}
                                    src={`${process.env.NEXT_PUBLIC_Files_URL}/${image}`}
                                    alt="Preview"
                                    className="rounded border"
                                />
                                <Button 
                                    variant="outlined" 
                                    color="error"
                                    onClick={() => setImage("")}
                                    disabled={loading}
                                >
                                    Remove Image
                                </Button>
                            </div>
                        )}
                        <div className="md:col-span-2">
                            <ImageUpload 
                                multiple={false} 
                                onUpload={setImage} 
                                disabled={loading}
                            />
                        </div>
                    </div>
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
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {editId ? "Update" : "Create"}
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
                                <TableCell>Date</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.length ? (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.date?.month}</span>
                                                <span>{item.date?.day}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.image && (
                                                <Image 
                                                    width={80} 
                                                    height={60} 
                                                    src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.image}`} 
                                                    alt={item.title} 
                                                    className="w-20 h-15 object-cover rounded"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">{item.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                                        <TableCell className="max-w-xs truncate">{item.link}</TableCell>
                                        <TableCell className="flex gap-2">
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
                                        No initiatives found
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

export default Page;