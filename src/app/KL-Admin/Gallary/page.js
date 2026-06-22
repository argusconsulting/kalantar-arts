"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../Components/ImageUpload";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Image from "next/image";

const Page = () => {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [link, setLink] = useState("");
    const [linkLabel, setLinkLabel] = useState("");
    const [aspectRatio, setAspectRatio] = useState("1/1");
    const [order, setOrder] = useState("");
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                },
                cache: "no-store",
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const result = await response.json();
            setData(Array.isArray(result) ? result : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to fetch gallery items");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!image || !aspectRatio || !order) {
            setError("Image, Aspect Ratio, and Order are required");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const method = editId ? "PUT" : "POST";
            const url = editId
                ? `${process.env.NEXT_PUBLIC_API_URL}/gallery/${editId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/gallery`;

            const payload = {
                image,
                caption,
                link: link || "#",
                link_label: linkLabel || "Open Link",
                aspectRatio,
                order: parseInt(order),
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Request failed");

            setSuccess(editId ? "gallery item updated!" : "gallery item created!");
            resetForm();
            fetchData();
            setOpen(false);
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.message || "Failed to process request");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                },
            });

            if (!response.ok) throw new Error("Delete failed");

            setSuccess("gallery item deleted!");
            fetchData();
        } catch (err) {
            console.error("Delete error:", err);
            setError(err.message || "Failed to delete");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setImage(item.image);
        setCaption(item.caption || "");
        setLink(item.link || "");
        setLinkLabel(item.link_label || "");
        setAspectRatio(item.aspectRatio || "1/1");
        setOrder(item.order.toString());
        setOpen(true);
    };

    const resetForm = () => {
        setCaption("");
        setImage("");
        setLink("");
        setLinkLabel("");
        setAspectRatio("1/1");
        setOrder("");
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
                <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"}>
                    {error || success}
                </Alert>
            </Snackbar>

            {/* <Button 
                variant="contained" 
                onClick={() => setOpen(true)}
                disabled={loading}
            >
                Add gallery Item
            </Button> */}

            <Dialog open={open} onClose={() => !loading && setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{editId ? "Edit gallery Item" : "New gallery Item"}</DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Aspect Ratio *</InputLabel>
                            <Select
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                label="Aspect Ratio *"
                                required
                            >
                                <MenuItem value="1/1">Square (1:1)</MenuItem>
                                <MenuItem value="2/1">Landscape (2:1)</MenuItem>
                                <MenuItem value="1/2">Portrait (1:2)</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Display Order *"
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            margin="dense"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            margin="dense"
                            className="md:col-span-2"
                        />

                        <TextField
                            fullWidth
                            label="Link URL"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            margin="dense"
                            className="md:col-span-1"
                        />

                        <TextField
                            fullWidth
                            label="Link Button Text"
                            value={linkLabel}
                            onChange={(e) => setLinkLabel(e.target.value)}
                            margin="dense"
                            className="md:col-span-1"
                            placeholder="e.g. Read More, Buy Tickets"
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
                    <Button onClick={() => !loading && setOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {editId ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            {loading ? (
                <div className="flex justify-center mt-6">
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper} className="mt-6">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Preview</TableCell>
                                <TableCell>Caption</TableCell>
                                <TableCell>Aspect Ratio</TableCell>
                                <TableCell>Order</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Image
                                            width={80}
                                            height={60}
                                            src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.image}`}
                                            alt={item.caption}
                                            className="rounded border"
                                        />
                                    </TableCell>
                                    <TableCell>{item.caption}</TableCell>
                                    <TableCell>{item.aspectRatio}</TableCell>
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell>
                                        <Button 
                                            onClick={() => handleEdit(item)}
                                            color="primary"
                                            size="small"
                                        >
                                            Edit
                                        </Button>
                                        {/* <Button 
                                            onClick={() => handleDelete(item.id)} 
                                            color="error"
                                            size="small"
                                        >
                                            Delete
                                        </Button> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default Page;