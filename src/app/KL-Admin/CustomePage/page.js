"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../Components/ImageUpload";
import { Button, Table, Select, MenuItem, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from "@mui/material";
import Image from "next/image";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const Page = () => {
    const [customepageId, setCustomepageId] = useState("");
    const [slug, setSlug] = useState("");
    const [jsonContent, setJsonContent] = useState([{ name: "", role: "", image: "", description: "" }]);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [submenudata, setsubmenudata] = useState([]);
    const [showImageUpload, setShowImageUpload] = useState({}); // Track visibility of ImageUpload per index

    // Fetch data and submenu on component mount
    useEffect(() => {
        fetchData();
        fetchsubmenu();
    }, []);

    // Fetch dynamic pages data
    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dynamic_pages`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
        });
        const result = await response.json();
        setData(result);
    };

    // Fetch submenu data
    const fetchsubmenu = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
        });
        const result = await response.json();
        setsubmenudata(result);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? "PUT" : "POST";
        const url = editId
            ? `${process.env.NEXT_PUBLIC_API_URL}/dynamic_pages/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/dynamic_pages`;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            body: JSON.stringify({
                customepage_id: customepageId,
                slug,
                json_content: JSON.stringify(jsonContent)
            }),
        });

        if (response.ok) {
            alert(editId ? "Page updated successfully!" : "Page created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to process request. Please try again.");
        }
    };

    // Delete a page
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this page?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dynamic_pages/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.JWT_SECRET}`,
                },
            });
            if (response.ok) {
                alert("Page deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    // Edit an existing page
    const handleEdit = (item) => {
        setEditId(item.id);
        setCustomepageId(item.customepage_id);
        setSlug(item.slug);
        
        let content = item.json_content;
        if (typeof content === "string") {
            try {
                content = JSON.parse(content);
            } catch (e) {
                content = [];
            }
        }
        setJsonContent(content || []);
        setShowImageUpload({}); // Reset image upload visibility
        setOpen(true);
    };

    // Reset form fields and state
    const resetForm = () => {
        setCustomepageId("");
        setSlug("");
        setJsonContent([{ name: "", role: "", image: "", description: "" }]);
        setEditId(null);
        setShowImageUpload({}); // Clear upload visibility state
    };

    // Add a new content entry
    const addJsonEntry = () => {
        setJsonContent([...jsonContent, { name: "", role: "", image: "", description: "" }]);
    };

    // Remove a content entry
    const removeJsonEntry = (index) => {
        const updated = jsonContent.filter((_, i) => i !== index);
        setJsonContent(updated);
    };

    // Handle changes in content entries
    const handleJsonChange = (index, field, value) => {
        const updated = [...jsonContent];
        updated[index][field] = value;
        setJsonContent(updated);
    };

    return (
        <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create New Page
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{editId ? "Edit Page" : "Create New Page"}</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-4">
                        <Select 
                            fullWidth 
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select Slug for page</MenuItem>
                            {submenudata.filter((menu) => menu.customepage === 1).map((menu) => (
                                <MenuItem key={menu.id} value={menu.link}>
                                    {menu.link}
                                </MenuItem>
                            ))}
                        </Select>

                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-2">Content Entries</h3>
                            {jsonContent.map((entry, index) => (
                                <div key={index} className="border p-4 mb-4 rounded-lg relative">
                                    <IconButton
                                        className="absolute top-2 right-2"
                                        onClick={() => removeJsonEntry(index)}
                                        color="error"
                                    >
                                        <RemoveCircleOutline />
                                    </IconButton>
                                    <div className="grid grid-cols-2 gap-4">
                                        <TextField
                                            label="Name"
                                            value={entry.name}
                                            onChange={(e) => handleJsonChange(index, 'name', e.target.value)}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Role"
                                            value={entry.role}
                                            onChange={(e) => handleJsonChange(index, 'role', e.target.value)}
                                            fullWidth
                                        />
                                        <div className="col-span-2">
                                            <TextField
                                                label="Description"
                                                value={entry.description}
                                                onChange={(e) => handleJsonChange(index, 'description', e.target.value)}
                                                multiline
                                                rows={3}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            {entry.image && (
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={`${process.env.NEXT_PUBLIC_Files_URL}/${entry.image}`}
                                                    alt="Content"
                                                    className="w-24 h-24 object-cover mb-2"
                                                />
                                            )}
                                            {showImageUpload[index] ? (
                                                <ImageUpload
                                                    multiple={false}
                                                    onUpload={(imagePath) => handleJsonChange(index, 'image', imagePath)}
                                                />
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setShowImageUpload(prev => ({ ...prev, [index]: true }))}
                                                >
                                                    Enable Image Upload
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleOutline />}
                                onClick={addJsonEntry}
                                className="mt-2"
                            >
                                Add Content Entry
                            </Button>
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

            <TableContainer component={Paper} className="mt-6">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Slug</TableCell>
                            <TableCell>Entries</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.slug}</TableCell>
                                <TableCell>
                                    {(() => {
                                        let content = item.json_content;
                                        if (typeof content === "string") {
                                            try {
                                                content = JSON.parse(content);
                                            } catch (e) {
                                                content = [];
                                            }
                                        }
                                        return (content || []).length;
                                    })()} entries
                                </TableCell>
                                <TableCell className="flex gap-x-4">
                                    <Button size="small" onClick={() => handleEdit(item)} variant="contained" color="secondary">
                                        Edit
                                    </Button>
                                    <Button size="small" onClick={() => handleDelete(item.id)} variant="contained" color="error">
                                        Delete
                                    </Button>
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