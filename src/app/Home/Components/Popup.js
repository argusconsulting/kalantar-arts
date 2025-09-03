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

                if (!response.ok) throw new Error('Failed to fetch popup');
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4">
            <div className=" max-h-[90%] bg-white rounded-lg shadow-xl max-w-2xl w-full relative animate-fade-in">
                

                <div  className=" w-full flex justify-end p-3">
                    <button onClick={() => setVisible(false)}><CloseIcon /></button>
                </div>

                <div className="p-6">
                    {popup.type === "image" ? (
                        <div className="flex justify-center w-full">
                        <div className="w-full max-w-4xl">
                          <Image
                            width={1000}
                            height={1000}
                            src={`${process.env.NEXT_PUBLIC_Files_URL}/${popup.content}`}
                            alt="Popup"
                            className="w-full h-auto rounded object-contain"
                          />
                        </div>
                      </div>
                      
                        
                    ) : (
                        <div className=" overflow-hidden" dangerouslySetInnerHTML={{ __html: popup.content }} />
                    )}

                    {popup.link && (
                        <div className="mt-4 text-center">
                            <a
                                href={popup.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-2 bg-[#e84691] text-white  rounded-full hover:bg-[#cc4383] transition-colors"
                            >
                                {popup.linkName} <KeyboardDoubleArrowRightOutlinedIcon />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupComponent;