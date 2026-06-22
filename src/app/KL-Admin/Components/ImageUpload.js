"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const ImageUpload = ({ multiple = false, onUpload }) => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
        setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
        setUploaded(false);
    };

    const handleUpload = useCallback(async () => {
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
            setUploaded(true);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    }, [files, multiple, onUpload]);

    useEffect(() => {
        if (files.length > 0 && !uploaded && !loading) {
            handleUpload();
        }
    }, [files, uploaded, loading, handleUpload]);

    return (
        <div className="flex flex-col gap-2">
            <input type="file" multiple={multiple} onChange={handleFileChange} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className={`cursor-pointer text-white px-4 py-2 rounded text-center transition-colors ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}>
                {loading ? "Uploading automatically..." : "Select Image"}
            </label>
            {previews.length > 0 && (
                <div className="flex gap-2 mt-2">
                    {previews.map((src, index) => (
                        <Image height={16} width={16} key={index} src={src} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    ))}
                </div>
            )}
            {uploaded && (
                <span className="text-green-600 text-xs font-bold mt-1">✓ File uploaded successfully</span>
            )}
        </div>
    );
};

export default ImageUpload;
