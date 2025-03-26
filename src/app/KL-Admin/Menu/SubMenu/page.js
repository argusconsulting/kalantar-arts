"use client";

import { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, Select, MenuItem } from "@mui/material";

const Page = () => {
    const [title, setTitle] = useState("");
    const [isLink, setIsLink] = useState(false);
    const [slug, setSlug] = useState("");
    const [mainMenuId, setMainMenuId] = useState("");
    const [mainMenus, setMainMenus] = useState([]);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
        fetchMainMenus();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenu`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store",
        });
        const result = await response.json();
        setData(result);
    };

    const fetchMainMenus = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/MainMenu`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store",
        });
        const result = await response.json();
        setMainMenus(result);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? "PUT" : "POST";
        const url = editId
            ? `${process.env.NEXT_PUBLIC_API_URL}/SubMenu/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/SubMenu`;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store",
            body: JSON.stringify({ main_menu_id: mainMenuId, title, IsLink: isLink, slug }),
        });

        if (response.ok) {
            alert(editId ? "SubMenu updated successfully!" : "SubMenu created successfully!");
            resetForm();
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to process request. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenu/${id}`, { method: "DELETE", headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store", });
            if (response.ok) {
                alert("SubMenu deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setMainMenuId(item.main_menu_id);
        setTitle(item.title);
        setIsLink(item.IsLink);
        setSlug(item.slug);
        setOpen(true);
    };

    const resetForm = () => {
        setMainMenuId("");
        setTitle("");
        setIsLink(false);
        setSlug("");
        setEditId(null);
    };

    return (
        <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Create Sub Menu
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editId ? "Edit Sub Menu" : "Create Sub Menu"}</DialogTitle>
                <DialogContent>
                    <Select fullWidth value={mainMenuId} onChange={(e) => setMainMenuId(e.target.value)} displayEmpty>
                        <MenuItem value="" disabled>Select Main Menu</MenuItem>
                        {mainMenus.map((menu) => (
                            <MenuItem key={menu.id} value={menu.id}>{menu.title}</MenuItem>
                        ))}
                    </Select>
                    <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} margin="dense" required />
                    <div className="flex items-center mt-2">
                        <Checkbox checked={isLink} onChange={(e) => setIsLink(e.target.checked)} />
                        <label>Is Link</label>
                    </div>
                    <TextField fullWidth label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} margin="dense" required />
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
                            <TableCell>Main Menu</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Is Link</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Creation Date</TableCell>
                            <TableCell>Update Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{mainMenus.find(menu => menu.id === item.main_menu_id)?.title || "N/A"}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>
                                    <Checkbox checked={item.IsLink} disabled />
                                </TableCell>
                                <TableCell>{item.slug}</TableCell>
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
                                {/* <TableCell>{item.creation_date}</TableCell>
                                <TableCell>{item.update_date}</TableCell> */}
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
