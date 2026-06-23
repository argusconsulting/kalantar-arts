"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import ImageUpload from "../Components/ImageUpload";

const TipTapEditor = dynamic(() => import("../Components/TipTapEditor"), { ssr: false });

const Page = () => {
    const [richtext, setRichtext] = useState("");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Additional fields to send to API
    const [image, setImage] = useState("");
    const [imageUrls, setImageUrls] = useState(""); // Stores specific URLs for each image
    const [url, setUrl] = useState("");
    const [urlLabel, setUrlLabel] = useState("");
    const [youtubeUrls, setYoutubeUrls] = useState("");
    const [newYoutubeUrl, setNewYoutubeUrl] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks`,{
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
        if (!editId) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenuLinks/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
                },
                body: JSON.stringify({ Richtext: richtext, image, url, url_label: urlLabel, image_urls: imageUrls, youtube_urls: youtubeUrls }),
            });

            if (response.ok) {
                alert("Page updated successfully!");
                fetchData();
                setOpen(false);
            } else {
                const errBody = await response.text();
                alert(`Failed to update (${response.status}): ${errBody}`);
            }
        } catch (err) {
            alert(`Network error: ${err.message}`);
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setEditName(item.name);
        setRichtext(item.Richtext || "");
        setImage(item.image || "");
        setImageUrls(item.image_urls || "");
        setUrl(item.url || "");
        setUrlLabel(item.url_label || "");
        setYoutubeUrls(item.youtube_urls || "");
        setNewYoutubeUrl("");
        setOpen(true);
    };

    const handleAddYoutubeUrl = () => {
        if (!newYoutubeUrl) return;
        setYoutubeUrls(prev => prev ? `${prev},${newYoutubeUrl}` : newYoutubeUrl);
        setNewYoutubeUrl("");
    };

    const handleRemoveYoutubeUrl = (index) => {
        const urls = youtubeUrls.split(',');
        urls.splice(index, 1);
        setYoutubeUrls(urls.join(','));
    };

    const handleImagesUploaded = (filenames) => {
        const names = Array.isArray(filenames) ? filenames : [filenames];
        setImage(prev => prev ? `${prev},${names.join(',')}` : names.join(','));
        
        // Append empty URLs for the new images
        const emptyUrls = names.map(() => "").join(',');
        setImageUrls(prev => prev ? `${prev},${emptyUrls}` : emptyUrls);
    };

    const handleImageUrlChange = (index, newUrl) => {
        const currentUrls = imageUrls ? imageUrls.split(',') : [];
        const currentImages = image ? image.split(',') : [];
        
        // Ensure the urls array is as long as images array
        while (currentUrls.length < currentImages.length) {
            currentUrls.push("");
        }
        
        currentUrls[index] = newUrl;
        // Escape commas in URLs just in case, though standard URLs shouldn't have them
        setImageUrls(currentUrls.join(','));
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Edit Dynamic Page Content</h2>
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

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
                <DialogTitle className="border-b pb-3 font-semibold text-gray-800">
                    Edit Page: <span className="text-pink-600 font-bold">{editName}</span>
                </DialogTitle>
                <DialogContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                        
                        {/* Media & URL Panel */}
                        <div className="space-y-6 lg:border-r lg:pr-6 border-gray-200">
                            {/* Multi-Image Upload */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span>🖼️</span> Upload Images
                                </h3>
                                <p className="text-xs text-gray-500 mb-3">
                                    Upload images for the gallery. You can optionally assign a specific link to each image below.
                                </p>
                                <ImageUpload multiple={true} onUpload={handleImagesUploaded} />
                                
                                {image && (
                                    <div className="mt-4 border-t pt-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-xs font-medium text-blue-700">Currently Saved Images:</label>
                                            <button type="button" onClick={() => { setImage(""); setImageUrls(""); }} className="text-[10px] text-red-600 hover:underline cursor-pointer">Clear Images</button>
                                        </div>
                                        <div className="flex flex-col gap-3 mt-3">
                                            {image.split(',').map((img, idx) => {
                                                const currentUrls = imageUrls ? imageUrls.split(',') : [];
                                                const currentUrl = currentUrls[idx] || "";
                                                return (
                                                    <div key={idx} className="flex gap-3 items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                                        <img src={`${process.env.NEXT_PUBLIC_Files_URL}/${img}`} className="w-16 h-16 object-cover rounded shadow-sm border border-gray-100 flex-shrink-0" alt="saved" />
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] text-gray-500 mb-1">Image Click Link (Optional)</label>
                                                            <input 
                                                                type="text"
                                                                value={currentUrl}
                                                                onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                                                                placeholder="https://partner-website.com"
                                                                className="w-full text-xs border border-gray-300 rounded p-1.5 focus:ring-1 focus:ring-blue-400 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* YouTube Videos Tool (Only visible for Video pages) */}
                            {editName?.toLowerCase().includes("video") && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <span>🎥</span> YouTube Video Gallery
                                    </h3>
                                    
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Add YouTube Link</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                value={newYoutubeUrl}
                                                onChange={(e) => setNewYoutubeUrl(e.target.value)}
                                                className="flex-1 text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={handleAddYoutubeUrl}
                                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 rounded-lg shadow-sm"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    {youtubeUrls && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-medium text-red-700 mb-2">Saved Videos:</label>
                                            <div className="flex flex-col gap-2">
                                                {youtubeUrls.split(',').map((ytUrl, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-red-100 shadow-sm">
                                                        <span className="text-xs text-gray-700 truncate w-4/5" title={ytUrl}>{ytUrl}</span>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleRemoveYoutubeUrl(idx)}
                                                            className="text-red-500 hover:text-red-700 font-bold text-xs"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Saved URL tool */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span>🔗</span> Global Page Action Button
                                </h3>
                                
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">URL to visit</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none mb-3"
                                    />
                                    
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Label (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Click here to participate"
                                        value={urlLabel}
                                        onChange={(e) => setUrlLabel(e.target.value)}
                                        className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">This will show as a massive button at the very bottom of the page.</p>
                                </div>
                            </div>
                        </div>

                        {/* Rich Text Editor Panel */}
                        <div className="lg:col-span-2 flex flex-col h-[500px]">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Page Text Content</label>
                                <Button variant="outlined" size="small" onClick={() => setIsFullScreen(!isFullScreen)}>
                                    {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
                                </Button>
                            </div>
                            
                            <div className={`flex-1 border border-gray-300 rounded-lg overflow-hidden bg-white ${isFullScreen ? "fixed inset-0 z-[2000] p-4 w-screen h-screen flex flex-col" : "relative flex flex-col h-full"}`}>
                                {isFullScreen && (
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold text-lg text-gray-800">Fullscreen Editor</h3>
                                        <Button variant="contained" size="small" onClick={() => setIsFullScreen(false)}>
                                            <FullscreenExit /> Exit Fullscreen
                                        </Button>
                                    </div>
                                )}
                                <div className="flex-1 overflow-y-auto pb-12">
                                    <TipTapEditor value={richtext} onChange={setRichtext} />
                                </div>
                            </div>
                        </div>

                    </div>
                </DialogContent>
                <DialogActions className="border-t pt-3 px-6">
                    <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Update Content</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Page;
