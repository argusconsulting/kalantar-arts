"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ImageUpload from "../Components/ImageUpload";
import "react-quill/dist/quill.snow.css";
import { Button, TextField, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Fullscreen, FullscreenExit, Edit, Delete, Add } from "@mui/icons-material";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Page = () => {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [activeImageUpload, setActiveImageUpload] = useState("hero");
    const [Petals, setPetals] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [isformer, setIsformer] = useState(false);
    useEffect(() => {
        fetchPetals();
    }, []);

    const fetchPetals = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Petals`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store",
        });
        const data = await response.json();
        setPetals(data);

        console.log(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId
                ? `${process.env.NEXT_PUBLIC_API_URL}/Petals/${editingId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/Petals`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.JWT_SECRET}`,
                  },
                  cache: "no-store",
                body: JSON.stringify({
                    title,
                    subtitle,
                    slug,
                    description,
                    hero_img: heroImage,
                    images: JSON.stringify(galleryImages),
                }),
            });

            if (response.ok) {
                alert(editingId ? "Successfully updated" : "Successfully created");
                fetchPetals();
                window.location.reload();
                resetForm();
            } else {
                throw new Error("Failed to save data");
            }
        } catch (error) {
            console.error("Error saving data:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Petals/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET}`,
              },
              cache: "no-store"
        });
        fetchPetals();
    };

    const handleEdit = (item) => {
        setIsformer(true);
        setTitle(item.title);
        setSubtitle(item.subtitle);
        setSlug(item.slug);
        setDescription(item.description);
        setHeroImage(item.hero_img);
        setGalleryImages(JSON.parse(item.images));
        setEditingId(item.id);
    };

    const resetForm = () => {
        setIsformer(true);
        setTitle("");
        setSubtitle("");
        setSlug("");
        setDescription("");
        setHeroImage("");
        setGalleryImages([]);
        setEditingId(null);
    };


    const handleDeleteImage = (indexToDelete) => {
        setGalleryImages((prevImages) =>
          prevImages.filter((_, index) => index !== indexToDelete)
        );
      };
    return (
        <div className="p-4">
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={resetForm}
                className="mb-4"
            >
                Create New
            </Button>
            {
                isformer && (
                    <Card className="mb-6 p-4 shadow-lg">
                        <Button onClick={(e) => setIsformer(false)} className=" bg-red-600 p-2 text-white">Close</Button>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                                <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} required />
                                <TextField label="Subtitle" fullWidth value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
                                <TextField label="Slug" fullWidth value={slug} onChange={(e) => setSlug(e.target.value)} required />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hero Image</label>
                                    <div>
                                        <label>Cureent Images</label>
                                        <div>
                                            
                                         
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                         width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${heroImage}`} alt="Gallery" className="w-16 h-16 object-cover mr-2 mb-2" />
                                                   
                                                </div>
                                           
                                        </div>
                                        
                                    </div>
                                    {activeImageUpload === "hero" && <ImageUpload multiple={false} onUpload={setHeroImage} />}
                                    <Button variant="contained" size="small" onClick={() => setActiveImageUpload("hero")}>
                                        Activate Hero Image Upload
                                    </Button>
                                </div>
                                <div className=" w-full">
                                   
                                    
                                    <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                                    <div className=" w-full">
                                        <label>Cureent Images</label>
                                        <div className=" w-full">
                                            
                                            {galleryImages.map((image, index) => (
                                                <div key={index} className="flex flex-row items-center gap-2">
                                                    <Image
                                                        key={image} width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${image}`} alt="Gallery" className="w-16 h-16 object-cover mr-2 mb-2" />
                                                    <IconButton onClick={() => handleDeleteImage(index)}>
                                                        <Delete />
                                                    </IconButton>
                                                </div>
                                            ))}
                                        </div>
                                        
                                    </div>
                                    {activeImageUpload === "gallery" && <ImageUpload multiple={true} onUpload={setGalleryImages} />}
                                    <Button variant="contained" size="small" onClick={() => setActiveImageUpload("gallery")}>
                                        Activate Gallery Image Upload
                                    </Button>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <div className={`  border rounded-lg ${isFullScreen ? "fixed inset-0 bg-white z-50 p-4 w-screen h-screen" : "p-2"}`}>
                                        <div className="flex justify-end">
                                            <Button variant="contained" size="small" onClick={() => setIsFullScreen(!isFullScreen)}>
                                                {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
                                            </Button>
                                        </div>
                                        <ReactQuill value={description} onChange={setDescription} className="h-full" />
                                    </div>
                                </div>
                                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                                    {loading ? "Processing..." : editingId ? "Update" : "Create"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                )
            }

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Subtitle</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Hero_Image</TableCell>
                            <TableCell>Image Gallary</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Petals.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.subtitle}</TableCell>
                                <TableCell>{item.slug}</TableCell>
                                <TableCell> <Image width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${item?.hero_img}`} alt="Hero" className="w-16 h-16 object-cover" /></TableCell>
                                <TableCell>
                                    {JSON.parse(item?.images)?.map((image) => (
                                        <Image key={image} width={50} height={50} src={`${process.env.NEXT_PUBLIC_Files_URL}/${image}`} alt="Gallery" className="w-16 h-16 object-cover mr-2 mb-2" />
                                    ))}
                                </TableCell>
                               
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleEdit(item)}><Edit /></IconButton>
                                    <IconButton color="secondary" onClick={() => handleDelete(item.id)}><Delete /></IconButton>
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
