"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../Components/ImageUpload";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Image from "next/image";

const Page = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [firstBoxTitle, setFirstBoxTitle] = useState("");
    const [firstBoxDesc, setFirstBoxDesc] = useState("");
    const [secondBoxTitle, setSecondBoxTitle] = useState("");
    const [secondBoxDesc, setSecondBoxDesc] = useState("");
    const [thirdBoxTitle, setThirdBoxTitle] = useState("");
    const [thirdBoxDesc, setThirdBoxDesc] = useState("");
    const [fourthBoxTitle, setFourthBoxTitle] = useState("");
    const [fourthBoxDesc, setFourthBoxDesc] = useState("");
    
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ArtPurpose`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                },
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Handle different response structures
            const receivedData = Array.isArray(result) ? result : 
                               result.data ? result.data : 
                               result.items ? result.items : 
                               [];

            setData(Array.isArray(receivedData) ? receivedData : []);
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editId ? "PUT" : "POST";
            const url = editId
                ? `${process.env.NEXT_PUBLIC_API_URL}/ArtPurpose/${editId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/ArtPurpose`;

            const payload = {
                title,
                image,
                firstbox_title: firstBoxTitle,
                firstbox_description: firstBoxDesc,
                secondbox_title: secondBoxTitle,
                secondbox_description: secondBoxDesc,
                thirdbox_title: thirdBoxTitle,
                thirdbox_description: thirdBoxDesc,
                fourthbox_title: fourthBoxTitle,
                fourthbox_description: fourthBoxDesc,
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert(editId ? "Entry updated successfully!" : "Entry created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } catch (error) {
            console.error("Submission error:", error);
            alert(`Operation failed: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this entry?")) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ArtPurpose/${id}`, { 
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                alert("Entry deleted successfully!");
                fetchData();
            } catch (error) {
                console.error("Delete error:", error);
                alert(`Deletion failed: ${error.message}`);
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setTitle(item.title);
        setImage(item.image);
        setFirstBoxTitle(item.firstbox_title);
        setFirstBoxDesc(item.firstbox_description);
        setSecondBoxTitle(item.secondbox_title);
        setSecondBoxDesc(item.secondbox_description);
        setThirdBoxTitle(item.thirdbox_title);
        setThirdBoxDesc(item.thirdbox_description);
        setFourthBoxTitle(item.fourthbox_title);
        setFourthBoxDesc(item.fourthbox_description);
        setOpen(true);
    };

    const resetForm = () => {
        setTitle("");
        setImage("");
        setFirstBoxTitle("");
        setFirstBoxDesc("");
        setSecondBoxTitle("");
        setSecondBoxDesc("");
        setThirdBoxTitle("");
        setThirdBoxDesc("");
        setFourthBoxTitle("");
        setFourthBoxDesc("");
        setEditId(null);
    };

    return (
        <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create New Entry
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{editId ? "Edit Entry" : "Create New Entry"}</DialogTitle>
                <DialogContent>
                    <div className="grid gap-4 mt-4">
                        <TextField fullWidth label="Main Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        
                        <div className="flex items-center gap-2">
                            {image && (
                                <Image
                                    width={100}
                                    height={100}
                                    src={`${process.env.NEXT_PUBLIC_Files_URL}/${image}`}
                                    alt="Main Image"
                                    className="w-24 h-24 object-cover"
                                />
                            )}
                            <ImageUpload multiple={false} onUpload={setImage} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Content Boxes */}
                            {[1, 2, 3, 4].map((boxNumber) => {
                                const setTitleState = [
                                    setFirstBoxTitle,
                                    setSecondBoxTitle,
                                    setThirdBoxTitle,
                                    setFourthBoxTitle
                                ][boxNumber - 1];
                                
                                const setDescState = [
                                    setFirstBoxDesc,
                                    setSecondBoxDesc,
                                    setThirdBoxDesc,
                                    setFourthBoxDesc
                                ][boxNumber - 1];

                                const titleValue = [
                                    firstBoxTitle,
                                    secondBoxTitle,
                                    thirdBoxTitle,
                                    fourthBoxTitle
                                ][boxNumber - 1];

                                const descValue = [
                                    firstBoxDesc,
                                    secondBoxDesc,
                                    thirdBoxDesc,
                                    fourthBoxDesc
                                ][boxNumber - 1];

                                return (
                                    <div key={boxNumber} className="space-y-2">
                                        <h4 className="font-bold">{`Box ${boxNumber}`}</h4>
                                        <TextField
                                            fullWidth
                                            label="Title"
                                            value={titleValue}
                                            onChange={(e) => setTitleState(e.target.value)}
                                        />
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Description"
                                            value={descValue}
                                            onChange={(e) => setDescState(e.target.value)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editId ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            {loading ? (
                <div className="mt-6 text-center">Loading...</div>
            ) : error ? (
                <div className="mt-6 text-center text-red-500">Error: {error}</div>
            ) : (
                <TableContainer component={Paper} className="mt-6">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Main Title</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Boxes Preview</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(data) && data.length > 0 ? (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>
                                            {item.image && (
                                                <Image
                                                    width={80}
                                                    height={80}
                                                    src={`${process.env.NEXT_PUBLIC_Files_URL}/${item.image}`}
                                                    alt="Main Image"
                                                    className="w-20 h-20 object-cover"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['first', 'second', 'third', 'fourth'].map((box) => (
                                                    <div key={box} className="p-2 border rounded">
                                                        <h5 className="font-bold">{item[`${box}box_title`]}</h5>
                                                        <p className="text-sm line-clamp-2">
                                                            {item[`${box}box_description`]}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="small" onClick={() => handleEdit(item)} variant="contained" color="secondary">
                                                    Edit
                                                </Button>
                                                <Button size="small" onClick={() => handleDelete(item.id)} variant="contained" color="error">
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No data available
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