"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, Select, MenuItem } from "@mui/material";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const Page = () => {
    const [subMenuId, setSubMenuId] = useState("");
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [target, setTarget] = useState(0);
    const [richtext, setRichtext] = useState("");
    const [subMenus, setSubMenus] = useState([]);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [Custom_Link, setCustomeLink] = useState(0);
    const [Custom_ImagePage, setCustom_ImagePage] = useState(0);

    useEffect(() => {
        fetchData();
        fetchSubMenus();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
        });
        const result = await response.json();
        setData(result);
    };

    const fetchSubMenus = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenu`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
        });
        const result = await response.json();
        setSubMenus(result);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? "PUT" : "POST";
        const url = editId
            ? `${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks`;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
            },
            cache: "no-store",
            body: JSON.stringify({ sub_menu_id: subMenuId, name, link, target, Custom_Link, customepage: Custom_ImagePage }),
        });

        if (response.ok) {
            alert(editId ? "SubMenuLink updated successfully!" : "SubMenuLink created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to process request. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks/${id}`, {
                method: "DELETE", headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.JWT_SECRET}`,
                },
                cache: "no-store",
            });
            if (response.ok) {
                alert("SubMenuLink deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setSubMenuId(item.sub_menu_id);
        setName(item.name);
        setLink(item.link);
        setTarget(item.target);
        setRichtext(item.richtext);
        setCustomeLink(item.Custom_Link);
        setCustom_ImagePage(item.customepage);
        setOpen(true);
    };

    const resetForm = () => {
        setSubMenuId("");
        setName("");
        setLink("");
        setTarget(false);
        setRichtext("");
        setCustomeLink('');
        setCustom_ImagePage('');
        setEditId(null);
    };

    return (
        <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create Sub Menu Link
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editId ? "Edit Sub Menu Link" : "Create Sub Menu Link"}</DialogTitle>
                <DialogContent>
                    <Select fullWidth value={subMenuId} onChange={(e) => setSubMenuId(e.target.value)} displayEmpty>
                        <MenuItem value="" disabled>Select Sub Menu</MenuItem>
                        {subMenus.map((menu) => (
                            <MenuItem key={menu.id} value={menu.id}>{menu.title}</MenuItem>
                        ))}
                    </Select>
                    <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} margin="dense" required />
                    <TextField fullWidth label="Link" value={link} onChange={(e) => setLink(e.target.value)} margin="dense" required />
                    <div className="flex items-center mt-2">
                        <Checkbox checked={target === 1} onChange={(e) => setTarget(e.target.checked ? 1 : 0)} />
                        <label>Open in New Tab</label>
                    </div>
                    <div className="flex items-center mt-2">
                        <Checkbox checked={Custom_Link === 1} onChange={(e) => setCustomeLink(e.target.checked ? 1 : 0)} />
                        <label>For Custome Linked</label>
                    </div>

                    <div className="flex items-center mt-2">
                        <Checkbox checked={Custom_ImagePage === 1} onChange={(e) => setCustom_ImagePage(e.target.checked ? 1 : 0)} />
                        <label>Custome ImagesPage</label>
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
                            <TableCell>Sub Menu</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Link</TableCell>
                            <TableCell>Target</TableCell>
                            <TableCell>Custome Link</TableCell>
                            <TableCell>Custome ImagesPage</TableCell>
                            <TableCell>Creation Date</TableCell>
                            <TableCell>Update Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{subMenus.find(menu => menu.id === item.sub_menu_id)?.title || "N/A"}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.link}</TableCell>
                                <TableCell>
                                    <Checkbox checked={item.target === 1} disabled />
                                </TableCell>
                                <TableCell>
                                    <Checkbox checked={item.Custom_Link === 1} disabled />
                                </TableCell>
                                <TableCell>
                                    <Checkbox checked={item.customepage === 1} disabled />
                                </TableCell>


                                <TableCell>

                                    {new Date(item.creation_date).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </TableCell>
                                <TableCell>


                                    {new Date(item.update_date).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
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
