"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../Components/ImageUpload";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Image from "next/image";

const Page = () => {
    const [type, setType] = useState("");
    const [icon, setIcon] = useState("");
    const [image, setImage] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [href, setHref] = useState("");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Slider`, {
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
            ? `${process.env.NEXT_PUBLIC_API_URL}/Slider/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/Slider`;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store",
            body: JSON.stringify({ type, icon, image, title, description, href }),
        });

        if (response.ok) {
            alert(editId ? "Slider updated successfully!" : "Slider created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to process request. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Slider/${id}`, { method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.JWT_SECRET}`,
                  },
                  cache: "no-store",
             });
            if (response.ok) {
                alert("Slider deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setType(item.type);
        setIcon(item.icon);
        setImage(item.Image);
        setTitle(item.title);
        setDescription(item.description);
        setHref(item.href);
        setOpen(true);
    };

    const resetForm = () => {
        setType("");
        setIcon("");
        setImage([]);
        setTitle("");
        setDescription("");
        setHref("");
        setEditId(null);
    };

    return (
        <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create Slider
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editId ? "Edit Slider" : "Create Slider"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Type" value={type} onChange={(e) => setType(e.target.value)} margin="dense" required />
                    <TextField fullWidth label="Icon" value={icon} onChange={(e) => setIcon(e.target.value)} margin="dense" required />
                    <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} margin="dense" required />
                    <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} margin="dense" required />
                    <TextField fullWidth label="Href" value={href} onChange={(e) => setHref(e.target.value)} margin="dense" required />
                   <div className="flex items-center gap-2">
                                                                                               <Image
                                                                                                    width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${image}`} alt="Gallery" className="w-44 object-cover mr-2 p-2 mb-2" />
                                                                                              
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
                            <TableCell>Type</TableCell>
                            <TableCell>Icon</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Href</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>{item.icon}</TableCell>
                                <TableCell>
                                    <Image width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.Image}`} alt={item.Image} className="w-16 h-16 object-cover" />
                                </TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.href}</TableCell>
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
