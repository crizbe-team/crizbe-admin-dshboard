'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface ProductGalleryProps {
    images: { id?: string | number; image: string }[];
    productName: string;
    productIcon?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName, productIcon }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const validImages = useMemo(() => {
        return images && images.length > 0 ? images : [];
    }, [images]);

    // Preload all gallery images into browser cache to eliminate network flashing
    useEffect(() => {
        if (validImages.length > 1) {
            validImages.forEach((imgObj) => {
                if (imgObj?.image) {
                    const img = new Image();
                    img.src = imgObj.image;
                }
            });
        }
    }, [validImages]);

    // Auto-change image if more than one image exists
    useEffect(() => {
        if (validImages.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            setSelectedIndex((prev) => (prev + 1) % validImages.length);
        }, 3500);

        return () => clearInterval(interval);
    }, [validImages.length, isHovered]);

    // Reset selected index when images array changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [images]);

    return (
        <div className="flex flex-col gap-6">
            {/* Main Image Container */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full aspect-square bg-[#F5F2EA] h-[350px] sm:h-[450px] lg:h-[550px] rounded-[32px] overflow-hidden shadow-xs group cursor-pointer"
            >
                {validImages.length > 0 ? (
                    validImages.map((imgObj, idx) => (
                        <img
                            key={imgObj.id || imgObj.image || idx}
                            src={imgObj.image}
                            alt={`${productName} - ${idx + 1}`}
                            className={`absolute inset-0 object-cover w-full h-full transform transition-all duration-700 ease-out ${
                                idx === selectedIndex
                                    ? 'opacity-100 scale-100 group-hover:scale-105 z-10'
                                    : 'opacity-0 scale-100 pointer-events-none z-0'
                            }`}
                        />
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                        {productIcon || '📦'}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {validImages.map((imgObj, index) => (
                        <button
                            key={imgObj.id || imgObj.image || index}
                            className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                                selectedIndex === index
                                    ? 'border-[#552C10] opacity-100 scale-105 shadow-xs'
                                    : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <img
                                src={imgObj.image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
