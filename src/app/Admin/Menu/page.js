"use client";

import { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox } from "@mui/material";

const Page = () => {
    const [title, setTitle] = useState("");
    const [subIsLink, setSubIsLink] = useState(false);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/MainMenu`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
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
            ? `${process.env.NEXT_PUBLIC_API_URL}/MainMenu/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/MainMenu`;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store",
            body: JSON.stringify({ title, Sub_isLink: subIsLink }),
        });

        if (response.ok) {
            alert(editId ? "MainMenu updated successfully!" : "MainMenu created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to process request. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/MainMenu/${id}`, { method: "DELETE", headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store", });
            if (response.ok) {
                alert("MainMenu deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setTitle(item.title);
        setSubIsLink(item.Sub_isLink);
        setOpen(true);
    };

    const resetForm = () => {
        setTitle("");
        setSubIsLink(false);
        setEditId(null);
    };

    return (
        <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create Main Menu
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editId ? "Edit Main Menu" : "Create Main Menu"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} margin="dense" required />
                    <div className="flex items-center mt-2">
                        <Checkbox checked={subIsLink} onChange={(e) => setSubIsLink(e.target.checked)} />
                        <label>Sub is Link</label>
                    </div>
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
                            <TableCell>Title</TableCell>
                            <TableCell>Menu Is Link</TableCell>
                            <TableCell>Creation Date</TableCell>
                            <TableCell>Update Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>
                                    <Checkbox checked={item.Sub_isLink} disabled />
                                </TableCell>
                                <TableCell>{item.creation_date}</TableCell>
                                <TableCell>{item.update_date}</TableCell>
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
