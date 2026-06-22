"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../Components/ImageUpload";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Image from "next/image";

const Page = () => {
    const [name, setName] = useState("");
    const [image, setImage] = useState([]);
    const [link, setLink] = useState("");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/highlight`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
            },
            cache: "no-store",
        });
        const result = await response.json();
        setData(result);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? "PUT" : "POST";
        const url = editId
            ? `${process.env.NEXT_PUBLIC_API_URL}/highlight/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/highlight`;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
            },
            cache: "no-store",
            body: JSON.stringify({ name, image, link }),
        });

        if (response.ok) {
            alert(editId ? "Highlight updated successfully!" : "Highlight created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to process request. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/highlight/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                },
                cache: "no-store",
            });
            if (response.ok) {
                alert("Highlight deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setName(item.name);
        setImage(item.image);
        setLink(item.link);
        setOpen(true);
    };

    const resetForm = () => {
        setName("");
        setImage([]);
        setLink("");
        setEditId(null);
    };

    return (
        <div className="p-6">
            {/* <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create Highlight
            </Button> */}

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editId ? "Edit Highlight" : "Create Highlight"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} margin="dense" required />
                    <TextField fullWidth label="Link" value={link} onChange={(e) => setLink(e.target.value)} margin="dense" required />
                    <div className="flex items-center gap-2">
                        {image && (
                            <Image width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${image}`} alt="Highlight" className="w-44 object-cover mr-2 p-2 mb-2" />
                        )}
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
                            <TableCell>Image</TableCell>
                            <TableCell>Link</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <Image width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.image}`} alt={item.image} className="w-16 h-16 object-cover" />
                                </TableCell>
                                <TableCell>{item.link}</TableCell>
                                <TableCell className="flex gap-x-4">
                                    <Button size="small" onClick={() => handleEdit(item)} variant="contained" color="secondary">Edit</Button>
                                    {/* <Button size="small" onClick={() => handleDelete(item.id)} variant="contained" color="error" className="ml-2">Delete</Button> */}
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
