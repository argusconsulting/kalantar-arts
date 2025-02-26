"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../Components/ImageUpload";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Image from "next/image";

const Page = () => {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState([]);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social_media`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store", // ✅ Ensure fresh data (Disable caching)
          });
        const result = await response.json();
        setData(result);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? "PUT" : "POST";
        const url = editId
            ? `${process.env.NEXT_PUBLIC_API_URL}/social_media/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/social_media`;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store",
            body: JSON.stringify({ name, link, image }),
        });

        if (response.ok) {
            alert(editId ? "Social Media updated successfully!" : "Social Media created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to process request. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/social_media/${id}`, { method: "DELETE" , headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store"});
            if (response.ok) {
                alert("Social Media deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setName(item.name);
        setLink(item.link);
        setImage(item.image);
        setOpen(true);
    };

    const resetForm = () => {
        setName("");
        setLink("");
        setImage([]);
        setEditId(null);
    };

    return (
        <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create Social Media
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editId ? "Edit Social Media" : "Create Social Media"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} margin="dense" required />
                    <TextField fullWidth label="Link" value={link} onChange={(e) => setLink(e.target.value)} margin="dense" required />
                        <div className="flex items-center gap-2">
                                                                            <Image
                                                                                 width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${image}`} alt="Gallery" className="w-16 h-16 object-cover mr-2 p-2 mb-2" />
                                                                           
                                                                        </div>
                    <ImageUpload multiple={false} onUpload={setImage} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editId ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            <TableContainer component={Paper} className="mt-6">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Link</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.link}</TableCell>
                                <TableCell>
                                    <Image width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.image}`} alt="Social Media" className="w-16 h-16 object-cover" />
                                </TableCell>
                                <TableCell className="flex gap-x-4">
                                    <Button size="small" onClick={() => handleEdit(item)} variant="contained" color="secondary">Edit</Button>
                                    <Button size="small" onClick={() => handleDelete(item.id)} variant="contained" color="error" className="ml-2">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Page;
