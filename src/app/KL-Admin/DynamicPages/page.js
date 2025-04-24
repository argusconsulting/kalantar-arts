"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { Fullscreen, FullscreenExit, Edit, Delete, Add } from "@mui/icons-material";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Page = () => {
    const [richtext, setRichtext] = useState("");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);



    const modules = {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers
          [{ font: [] }], // Font selection
          [{ size: [] }], // Font sizes
          ["bold", "italic", "underline", "strike"], // Text styles
          [{ script: "sub" }, { script: "super" }], // Subscript / superscript
          [{ color: [] }, { background: [] }], // Font & background colors
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // Lists
          [{ indent: "-1" }, { indent: "+1" }], // Indentation
          [{ align: [] }], // Alignments
          ["blockquote", "code-block"], // Blockquote & Code block
          ["link", "image", "video", "formula"], // Media & Math formulas
          [{ direction: "rtl" }], // Right-to-left text support
          ["clean"], // Remove formatting
        ],
      };


    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks`,{
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
        if (!editId) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store",
            body: JSON.stringify({ richtext }),
        });

        if (response.ok) {
            alert("Rich text updated successfully!");
            fetchData();
            setOpen(false);
        } else {
            alert("Failed to update. Please try again.");
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setRichtext(item.Richtext);
        setOpen(true);
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Edit Rich Text</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.filter((item) => item.customepage == 0).map((item) => (
                        <tr key={item.id}>
                            <td className="border border-gray-300 p-2">{item.name}</td>
                            <td className="border border-gray-300 p-2">
                                <Button size="small" onClick={() => handleEdit(item)} variant="contained" color="secondary">Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Edit Rich Text</DialogTitle>
                <DialogContent>
                     <div className="">
                                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                                        <div className={`  border rounded-lg ${isFullScreen ? "fixed inset-0 bg-white z-50 p-4 w-screen h-screen" : "p-2"}`}>
                                                            <div className="flex justify-end">
                                                                <Button variant="contained" size="small" onClick={() => setIsFullScreen(!isFullScreen)}>
                                                                    {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
                                                                </Button>
                                                            </div>
                                                            <ReactQuill  modules={modules}  value={richtext} onChange={setRichtext} className="h-full" />
                                                        </div>
                                                    </div>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Page;
