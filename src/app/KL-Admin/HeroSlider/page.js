"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../Components/ImageUpload";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Image from "next/image";

const Page = () => {
    const [Quote, setQuote] = useState("");
    const [Author, setAuthor] = useState("");
    const [HeroImage, setHeroImage] = useState([]);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Hero_Slider`,{
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
            ? `${process.env.NEXT_PUBLIC_API_URL}/Hero_Slider/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/Hero_Slider`;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
              },
              cache: "no-store",
            body: JSON.stringify({ quote: Quote, author: Author, image: HeroImage }),
        });

        if (response.ok) {
            alert(editId ? "Quote updated successfully!" : "Quote created successfully!");
            setQuote("");
            setAuthor("");
            setHeroImage([]);
            setEditId(null);
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to process request. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Hero_Slider/${id}`, { method: "DELETE", headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
              },
              cache: "no-store", });
            if (response.ok) {
                alert("Quote deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setQuote(item.quote);
        setAuthor(item.author);
        setHeroImage(item.image);
        setOpen(true);
    };

    return (
        <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create Quote
            </Button>

            <Dialog fullWidth maxWidth="md"   open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editId ? "Edit Quote" : "Create Quote"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        minRows={6} // Adjusts height (h-44 is roughly 6 rows)
                        label="Quote (Supports Hindi & English)"
                        value={Quote}
                        onChange={(e) => setQuote(e.target.value)}
                        margin="dense"
                        required
                        inputProps={{ lang: "hi" }} // Ensures proper rendering
                    />

                    <TextField
                        fullWidth
                        label="Author"
                        value={Author}
                        onChange={(e) => setAuthor(e.target.value)}
                        margin="dense"
                        required
                    />
                    <div className="flex items-center gap-2">
                                                                                                <Image
                                                                                                     width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${HeroImage}`} alt="Gallery" className="w-44 object-cover mr-2 p-2 mb-2" />
                                                                                               
                                                                                            </div>
                    <ImageUpload multiple={false} onUpload={setHeroImage} />
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
                            <TableCell>Quote</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.quote}</TableCell>
                                <TableCell>{item.author}</TableCell>
                                <TableCell>
                                    <Image width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.image}`} alt="Hero" className="w-16 h-16 object-cover" />
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
