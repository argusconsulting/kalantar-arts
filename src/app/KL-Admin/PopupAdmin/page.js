// Page.jsx
"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../Components/ImageUpload";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Image from "next/image";

const Page = () => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("image");
    const [content, setContent] = useState("");
    const [link, setLink] = useState("");
    const [linkName, setLinkName] = useState("");
    const [enabled, setEnabled] = useState(false);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Popups`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                },
                cache: "no-store", // ✅ Ensure fresh data (Disable caching)
              });
            const result = await response.json();
            setData(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? "PUT" : "POST";
        const url = editId ? `/Popups/${editId}` : "/Popups";

        const payload = {
            title,
            type,
            content,
            link,
            linkName,
            enabled
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                  },
            
                
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Popup saved successfully!");
                fetchData();
                setOpen(false);
                resetForm();
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this popup?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Popups/${id}`, { method: "DELETE" ,  headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
              },});
            if (response.ok) fetchData();
        }
    };

    const handleEdit = (popup) => {
        setEditId(popup.id);
        setTitle(popup.title);
        setType(popup.type);
        setContent(popup.content);
        setLink(popup.link);
        setLinkName(popup.linkName);
        setEnabled(popup.enabled);
        setOpen(true);
    };

    const resetForm = () => {
        setTitle("");
        setType("image");
        setContent("");
        setLink("");
        setLinkName("");
        setEnabled(false);
        setEditId(null);
    };

    return (
        <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create New Popup
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{editId ? "Edit Popup" : "New Popup"}</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-4">
                        <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
                                <MenuItem value="image">Image</MenuItem>
                                <MenuItem value="html">HTML</MenuItem>
                            </Select>
                        </FormControl>

                        {type === "image" ? (
                            <div className="flex items-center gap-4">
                                {content && (
                                    <Image
                                        width={150}
                                        height={100}
                                       
                                        src={`${process.env.NEXT_PUBLIC_Files_URL}/${content}`}
                                        alt="Popup preview"
                                        className="border rounded"
                                    />
                                )}
                                <ImageUpload onUpload={setContent} />
                            </div>
                        ) : (
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                label="HTML Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter HTML code here..."
                            />
                        )}
                  <label className="block text-sm text-gray-700">
      For HTML content, use JSX syntax. For example, use <code>className</code> instead of <code>class</code>:
      <pre className="bg-gray-100 text-sm p-2 rounded mt-2">
        {`<div className="w-full h-64 flex items-end justify-center bg-gray-100 relative overflow-hidden">
  <div className="w-12 h-12 bg-blue-500 rounded-full animate-bounce" />
</div>`}
      </pre>
    </label>

                        <TextField fullWidth label="Link URL" value={link} onChange={(e) => setLink(e.target.value)} />

                        <TextField fullWidth label="Link Name" value={linkName} onChange={(e) => setLinkName(e.target.value)} />
                        
                        <FormControlLabel
                            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
                            label="Enable Popup"
                        />
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
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Preview</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((popup) => (
                            <TableRow key={popup.id}>
                                <TableCell>{popup.title}</TableCell>
                                <TableCell>{popup.type}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded ${popup.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {popup.enabled ? "Active" : "Inactive"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {popup.type === "image" ? (
                                        <Image
                                            width={80}
                                            height={50}
                                            src={`${process.env.NEXT_PUBLIC_Files_URL}/${popup.content}`}
                                          
                                            alt="Popup preview"
                                            className="border rounded"
                                        />
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: popup.content }} className="line-clamp-2" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button variant="contained" size="small" onClick={() => handleEdit(popup)}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="error" size="small" onClick={() => handleDelete(popup.id)}>
                                            Delete
                                        </Button>
                                    </div>
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