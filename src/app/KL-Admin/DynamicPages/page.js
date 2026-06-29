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
    
    // SubMenus for checking conditions
    const [subMenus, setSubMenus] = useState([]);
    const [currentSubMenuId, setCurrentSubMenuId] = useState(null);

    // Additional fields to send to API
    const [image, setImage] = useState("");
    const [imageUrls, setImageUrls] = useState(""); // Stores specific URLs for each image
    const [url, setUrl] = useState("");
    const [urlLabel, setUrlLabel] = useState("");
    const [youtubeUrls, setYoutubeUrls] = useState("");
    const [newYoutubeUrl, setNewYoutubeUrl] = useState("");
    const [extraData, setExtraData] = useState({ profileBio: "", badgeText: "", features: [] });
    
    // Petals-style fields for Activities
    const [subtitle, setSubtitle] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [galleryImages, setGalleryImages] = useState([]);
    const [activeImageUpload, setActiveImageUpload] = useState(null);

    useEffect(() => {
        fetchData();
        fetchSubMenus();
    }, []);

    const fetchSubMenus = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SubMenu`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
            },
            cache: "no-store",
        });
        const result = await response.json();
        setSubMenus(result);
    };

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
                body: JSON.stringify({ 
                    Richtext: richtext, 
                    image, 
                    url, 
                    url_label: urlLabel, 
                    image_urls: imageUrls, 
                    youtube_urls: youtubeUrls, 
                    extra_data: JSON.stringify(extraData),
                    subtitle: subtitle,
                    hero_img: heroImage,
                    images: JSON.stringify(galleryImages)
                }),
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
        setCurrentSubMenuId(item.sub_menu_id);
        
        setSubtitle(item.subtitle || "");
        setHeroImage(item.hero_img || "");
        try {
            setGalleryImages(item.images ? JSON.parse(item.images) : []);
        } catch(e) {
            setGalleryImages([]);
        }
        
        try {
            setExtraData(item.extra_data ? JSON.parse(item.extra_data) : { profileBio: "", badgeText: "", features: [], teamMembers: [] });
        } catch(e) {
            setExtraData({ profileBio: "", badgeText: "", features: [], teamMembers: [] });
        }
        
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

    const handleImageNameChange = (index, newName) => {
        const currentNames = extraData?.imageNames ? [...extraData.imageNames] : [];
        const currentImages = image ? image.split(',') : [];
        
        while (currentNames.length < currentImages.length) {
            currentNames.push("");
        }
        
        currentNames[index] = newName;
        setExtraData({...extraData, imageNames: currentNames});
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
                            
                            {/* Activities / Petals Settings */}
                            {subMenus.find(sm => sm.id === currentSubMenuId)?.main_menu_id === 2 && (
                            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 shadow-sm">
                                <h3 className="text-sm font-semibold text-pink-700 mb-2 flex items-center gap-2">
                                    <span>🌸</span> Activity / Petals Fields
                                </h3>
                                
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                                    <input 
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        placeholder="e.g. Empowering minds..."
                                        className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Top Hero Image (Diamond Shape)</label>
                                    {heroImage && (
                                        <div className="flex items-center gap-2 mb-2 bg-white p-2 border rounded shadow-sm">
                                            <img src={`${process.env.NEXT_PUBLIC_Files_URL}/${heroImage}`} alt="Hero" className="w-12 h-12 object-cover rounded" />
                                            <button type="button" onClick={() => setHeroImage("")} className="text-xs text-red-500 hover:underline">Remove</button>
                                        </div>
                                    )}
                                    {activeImageUpload === "hero" ? (
                                        <ImageUpload multiple={false} onUpload={(f) => { setHeroImage(f); setActiveImageUpload(null); }} />
                                    ) : (
                                        <Button variant="outlined" size="small" onClick={() => setActiveImageUpload("hero")} className="w-full text-xs">
                                            Upload Hero Image
                                        </Button>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Bottom Sliding Gallery</label>
                                    {galleryImages.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2 bg-white p-2 border rounded shadow-sm max-h-40 overflow-y-auto">
                                            {galleryImages.map((img, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img src={`${process.env.NEXT_PUBLIC_Files_URL}/${img}`} className="w-10 h-10 object-cover rounded border" alt="gallery" />
                                                    <button type="button" onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {activeImageUpload === "gallery" ? (
                                        <ImageUpload multiple={true} onUpload={(files) => { setGalleryImages(files); setActiveImageUpload(null); }} />
                                    ) : (
                                        <Button variant="outlined" size="small" onClick={() => setActiveImageUpload("gallery")} className="w-full text-xs">
                                            Upload Gallery Images
                                        </Button>
                                    )}
                                </div>
                            </div>
                            )}

                            {/* Multi-Image Upload */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <span>🖼️</span> 
                                    {(editName?.toLowerCase().includes("chairman") || editName?.toLowerCase().includes("mentor")) 
                                        ? "Upload Hero & Profile Picture" 
                                        : "Upload Gallery Images (Top of Page)"}
                                </h3>
                                <p className="text-xs text-gray-500 mb-3">
                                    {(editName?.toLowerCase().includes("chairman") || editName?.toLowerCase().includes("mentor")) 
                                        ? "Upload exactly 2 images: The first one will be the large top Hero banner, the second will be the Profile picture in the card below." 
                                        : 'Use this ONLY for the automated gallery grid at the top of the page. If you want to insert images INSIDE the text below, use the "Image" button inside the text editor!'}
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
                                                const currentNames = extraData?.imageNames || [];
                                                const currentName = currentNames[idx] || "";
                                                return (
                                                    <div key={idx} className="flex gap-3 items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                                        <img src={`${process.env.NEXT_PUBLIC_Files_URL}/${img}`} className="w-16 h-16 object-cover rounded shadow-sm border border-gray-100 flex-shrink-0" alt="saved" />
                                                        <div className="flex-1 space-y-2">
                                                            <div>
                                                                <label className="block text-[10px] text-gray-500 mb-1">Image Name (Optional)</label>
                                                                <input 
                                                                    type="text"
                                                                    value={currentName}
                                                                    onChange={(e) => handleImageNameChange(idx, e.target.value)}
                                                                    placeholder="e.g. Event Highlights"
                                                                    className="w-full text-xs border border-gray-300 rounded p-1.5 focus:ring-1 focus:ring-blue-400 outline-none"
                                                                />
                                                            </div>
                                                            <div>
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

                            {/* Chairman / Mentor Profile Special Settings */}
                            {(editName?.toLowerCase().includes("chairman") || editName?.toLowerCase().includes("mentor")) && (
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm mt-4 space-y-3">
                                    <h3 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                                        <span>👑</span> Leadership Profile Settings
                                    </h3>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Badge Text (e.g. &quot;15+&quot;)</label>
                                        <input 
                                            value={extraData?.badgeText || ''} 
                                            onChange={(e) => setExtraData({...extraData, badgeText: e.target.value})}
                                            className="w-full text-sm border border-gray-300 p-2 mb-2 rounded focus:ring-1 focus:ring-purple-400 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Author Name (e.g. Vishal Srivastava)</label>
                                        <input 
                                            value={extraData?.authorName || ''} 
                                            onChange={(e) => setExtraData({...extraData, authorName: e.target.value})}
                                            className="w-full text-sm border border-gray-300 p-2 mb-2 rounded focus:ring-1 focus:ring-purple-400 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Author Designation (e.g. CHAIRMAN – KALANTAR ART FOUNDATION)</label>
                                        <input 
                                            value={extraData?.authorDesignation || ''} 
                                            onChange={(e) => setExtraData({...extraData, authorDesignation: e.target.value})}
                                            className="w-full text-sm border border-gray-300 p-2 mb-2 rounded focus:ring-1 focus:ring-purple-400 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Hero Description</label>
                                        <textarea 
                                            value={extraData?.heroDesc || ''} 
                                            onChange={(e) => setExtraData({...extraData, heroDesc: e.target.value})}
                                            className="w-full text-sm border border-gray-300 p-2 mb-2 rounded h-16 focus:ring-1 focus:ring-purple-400 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Profile Bio</label>
                                        <textarea 
                                            value={extraData?.profileBio || ''} 
                                            onChange={(e) => setExtraData({...extraData, profileBio: e.target.value})}
                                            className="w-full text-sm border border-gray-300 p-2 mb-2 rounded h-20 focus:ring-1 focus:ring-purple-400 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Features (Up to 4)</label>
                                        {[0,1,2,3].map(i => (
                                            <div key={i} className="flex gap-2 mb-2">
                                                <input 
                                                    placeholder={`Title ${i+1}`}
                                                    value={extraData?.features?.[i]?.title || ''}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(extraData?.features || [])];
                                                        if(!newFeatures[i]) newFeatures[i] = { title: '', desc: '' };
                                                        newFeatures[i].title = e.target.value;
                                                        setExtraData({...extraData, features: newFeatures});
                                                    }}
                                                    className="w-1/3 text-xs border border-gray-300 p-1.5 rounded focus:ring-1 focus:ring-purple-400 outline-none" 
                                                />
                                                <input 
                                                    placeholder={`Description ${i+1}`}
                                                    value={extraData?.features?.[i]?.desc || ''}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(extraData?.features || [])];
                                                        if(!newFeatures[i]) newFeatures[i] = { title: '', desc: '' };
                                                        newFeatures[i].desc = e.target.value;
                                                        setExtraData({...extraData, features: newFeatures});
                                                    }}
                                                    className="w-2/3 text-xs border border-gray-300 p-1.5 rounded focus:ring-1 focus:ring-purple-400 outline-none" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Executive Team / Founder / Advisor / Mentors / Volunteers Settings */}
                            {(editName?.toLowerCase().includes("executive") || editName?.toLowerCase().includes("founder") || editName?.toLowerCase().includes("advisor") || editName?.toLowerCase().includes("the mentors") || editName?.toLowerCase().includes("volunteer") || editName?.toLowerCase() === "mentors") && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm mt-4 space-y-3">
                                    <h3 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                        <span>👥</span> Team Members Builder
                                    </h3>
                                    
                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                                        {(extraData?.teamMembers || []).map((member, idx) => (
                                            <div key={idx} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm relative">
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const newTeam = [...(extraData?.teamMembers || [])];
                                                        newTeam.splice(idx, 1);
                                                        setExtraData({...extraData, teamMembers: newTeam});
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 z-10"
                                                >
                                                    &times;
                                                </button>

                                                <div className="flex gap-4 items-start p-2">
                                                    {/* Profile Picture Uploader for this specific member */}
                                                    <div className="w-32 flex-shrink-0 flex flex-col gap-2 items-center">
                                                        {member.inlineImg ? (
                                                            <div className="relative flex flex-col items-center">
                                                                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-4 border-green-200 shadow-md">
                                                                    <img src={`${process.env.NEXT_PUBLIC_Files_URL}/${member.inlineImg}`} className="w-full h-full object-cover" alt="Profile" />
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => {
                                                                            const newTeam = [...(extraData?.teamMembers || [])];
                                                                            newTeam[idx].inlineImg = "";
                                                                            setExtraData({...extraData, teamMembers: newTeam});
                                                                        }}
                                                                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">✅ Uploaded</span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-24 h-24 rounded-full bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center text-blue-300 shadow-inner">
                                                                <span className="text-3xl opacity-50">👤</span>
                                                            </div>
                                                        )}
                                                        
                                                        {activeImageUpload === `team_${idx}` ? (
                                                            <div className="scale-90 origin-top mt-1 w-full">
                                                                <ImageUpload multiple={false} onUpload={(filename) => { 
                                                                    const newTeam = [...(extraData?.teamMembers || [])];
                                                                    newTeam[idx].inlineImg = filename;
                                                                    setExtraData({...extraData, teamMembers: newTeam});
                                                                    setActiveImageUpload(null); 
                                                                }} />
                                                            </div>
                                                        ) : !member.inlineImg && (
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setActiveImageUpload(`team_${idx}`)}
                                                                className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full shadow-md w-full transition-colors flex items-center justify-center gap-1 mt-1"
                                                            >
                                                                <span>📷</span> Upload
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Text Inputs */}
                                                    <div className="flex-1 space-y-3">
                                                        <input 
                                                            placeholder="Member Name (e.g. Vishal Srivastava)"
                                                            value={member.name || ''}
                                                            onChange={(e) => {
                                                                const newTeam = [...(extraData?.teamMembers || [])];
                                                                newTeam[idx].name = e.target.value;
                                                                setExtraData({...extraData, teamMembers: newTeam});
                                                            }}
                                                            className="w-full text-sm font-bold text-gray-800 border-2 border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm" 
                                                        />
                                                        <textarea 
                                                            placeholder="Title / Description (e.g. Founder & Chairman...)"
                                                            value={member.desc || ''}
                                                            onChange={(e) => {
                                                                const newTeam = [...(extraData?.teamMembers || [])];
                                                                newTeam[idx].desc = e.target.value;
                                                                setExtraData({...extraData, teamMembers: newTeam});
                                                            }}
                                                            className="w-full text-sm text-gray-600 border-2 border-gray-200 p-2.5 rounded-lg h-20 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none resize-none transition-all shadow-sm" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const newTeam = [...(extraData?.teamMembers || []), { name: "", desc: "", inlineImg: "" }];
                                            setExtraData({...extraData, teamMembers: newTeam});
                                        }}
                                        className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 rounded-lg border border-blue-300 shadow-sm text-xs transition-colors flex items-center justify-center gap-1 mt-2"
                                    >
                                        <span>➕</span> Add New Team Member
                                    </button>
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
