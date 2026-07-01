"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';

const PopupComponent = () => {
    const [popup, setPopup] = useState(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const fetchActivePopup = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/Popups/?enabled=1`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.JWT_SECRET}`,
                        },
                        next: { revalidate: 60 } // refresh data every 60s

                    }
                );

                if (!response.ok) {
                    if (response.status === 404) return; // Graciously handle empty state without throwing
                    throw new Error('Failed to fetch popup');
                }
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    setPopup({
                        ...data[0],
                        // Convert className to class for HTML content
                        content: data[0].type === 'html'
                            ? data[0].content.replace(/className=/g, 'class=')
                            : data[0].content
                    });
                }
            } catch (error) {
                console.error("Error fetching popup:", error);
            }
        };
        fetchActivePopup();
    }, []);

    if (!popup || !visible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4 sm:p-6 transition-all duration-300">
            <div className="max-h-[90vh] bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative animate-fade-in flex flex-col overflow-hidden border border-white/20">

                {/* Floating Close Button */}
                <button
                    onClick={() => setVisible(false)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white text-gray-800 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                    aria-label="Close"
                >
                    <CloseIcon fontSize="small" />
                </button>

                <div className="overflow-hidden w-full p-6 sm:p-10 flex flex-col items-center">
                    {popup.type === "image" ? (
                        <div className="flex justify-center w-full max-h-[75vh]">
                            <div className="relative group rounded-2xl overflow-hidden shadow-sm flex justify-center items-center">
                                <Image
                                    width={1000}
                                    height={1000}
                                    src={`${process.env.NEXT_PUBLIC_Files_URL}/${popup.content}`}
                                    alt="Popup content"
                                    className="max-h-[75vh] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden tiptap-content prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: popup.content }} />
                    )}

                    {popup.link && (
                        <div className="mt-3 flex justify-center">
                            <a
                                href={popup.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#e84691] to-[#cc4383] text-white font-semibold rounded-full shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transform hover:-translate-y-1 transition-all duration-300 group"
                            >
                                {popup.linkName}
                                <KeyboardDoubleArrowRightOutlinedIcon className="transition-transform group-hover:translate-x-1" fontSize="small" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupComponent;