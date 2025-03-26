"use client";

import { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox } from "@mui/material";

const Page = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isRead, setIsRead] = useState(false);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact_submissions`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
        });
        const result = await response.json();
        setData(result.sort((a, b) => b.id - a.id)); // Sort here
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? "PUT" : "POST";
        const url = editId
            ? `${process.env.NEXT_PUBLIC_API_URL}/contact_submissions/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/contact_submissions`;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
            body: JSON.stringify({ 
                name, 
                email, 
                phone, 
                message, 
                is_read: isRead 
            }),
        });

        if (response.ok) {
            alert(editId ? "Contact submission updated successfully!" : "Contact submission created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to process request. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this contact submission?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact_submissions/${id}`, { 
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.JWT_SECRET}`,
                },
                cache: "no-store", 
            });
            if (response.ok) {
                alert("Contact submission deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setName(item.name);
        setEmail(item.email);
        setPhone(item.phone);
        setMessage(item.message);
        setIsRead(item.is_read);
        setOpen(true);
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setIsRead(false);
        setEditId(null);
    };

    return (
        <div className="p-6">
            {/* <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create Contact Submission
            </Button> */}

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editId ? "Edit Contact Submission" : "Create Contact Submission"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} margin="dense" required />
                    <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="dense" required type="email" />
                    <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} margin="dense" />
                    <TextField fullWidth label="Message" value={message} onChange={(e) => setMessage(e.target.value)} margin="dense" multiline rows={4} required />
                    <div className="flex items-center mt-2">
                        <Checkbox checked={isRead} onChange={(e) => setIsRead(e.target.checked)} />
                        <label>Is Read</label>
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
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Submission Date</TableCell>
                            {/* <TableCell>Is Read</TableCell>
                            <TableCell>IP Address</TableCell> */}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.phone}</TableCell>
                                <TableCell>{item.message.substring(0, 50)}{item.message.length > 50 ? "..." : ""}</TableCell>
                                <TableCell>{new Date(item.submission_date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })}</TableCell>
                                {/* <TableCell>
                                    <Checkbox checked={item.is_read} disabled />
                                </TableCell>
                                <TableCell>{item.ip_address}</TableCell> */}
                                <TableCell className="flex gap-x-4">
                                    {/* <Button size="small" onClick={() => handleEdit(item)} variant="contained" color="secondary">Edit</Button> */}
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