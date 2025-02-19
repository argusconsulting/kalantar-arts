"use client";

import { useState } from "react";

const ImageUpload = ({ multiple = false, onUpload }) => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
        setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
    };

    const handleUpload = async () => {
        if (!files.length) return;
        setLoading(true);
        const formData = new FormData();

        if (multiple) {
            files.forEach(file => formData.append("files", file));
        } else {
            formData.append("file", files[0]);
        }

        try {
            const response = await fetch(
                multiple
                    ? `${process.env.NEXT_PUBLIC_API_URL}/upload/multiple`
                    : `${process.env.NEXT_PUBLIC_API_URL}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();

            if (multiple) {
                onUpload(data.map(file => file.filename)); // Multiple files
            } else {
                onUpload(data.filename); // Single file
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input type="file" multiple={multiple} onChange={handleFileChange} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
                Select Image
            </label>
            {previews.length > 0 && (
                <div className="flex gap-2 mt-2">
                    {previews.map((src, index) => (
                        <img key={index} src={src} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    ))}
                </div>
            )}
            {files.length > 0 && (
                <p>{multiple ? `${files.length} files selected` : files[0].name}</p>
            )}
            <button onClick={handleUpload} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">
                {loading ? "Uploading..." : "Upload"}
            </button>
            {!loading ? (
                <span>File Uploaded</span>
            ):(
                (
                    <span></span>
                )
            )}
        </div>
    );
};

export default ImageUpload;
