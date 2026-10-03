'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

    // Unique stable key based on actual image URLs/IDs to avoid volatile array reference resets
    const imagesKey = useMemo(() => {
        return validImages.map((img) => img.id || img.image).join(',');
    }, [validImages]);

    // Reset selected index ONLY when the image IDs/URLs list actually changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [imagesKey]);

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
        }, 4000);

        return () => clearInterval(interval);
    }, [validImages.length, isHovered]);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % validImages.length);
    };

    const currentImage = validImages[selectedIndex] || validImages[0];

    return (
        <div className="flex flex-col gap-5">
            {/* Main Image Container */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full aspect-square bg-[#FAF6EE] border border-[#EADBBD]/40 rounded-[32px] overflow-hidden shadow-xs group cursor-pointer min-h-[350px] sm:min-h-[450px]"
            >
                {currentImage?.image ? (
                    <img
                        key={currentImage.id || currentImage.image || selectedIndex}
                        src={currentImage.image}
                        alt={`${productName} - View ${selectedIndex + 1}`}
                        className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                        {productIcon || '📦'}
                    </div>
                )}

                {/* Left / Right Arrow Controls */}
                {validImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#4E3325] backdrop-blur-md shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            aria-label="Previous Image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#4E3325] backdrop-blur-md shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            aria-label="Next Image"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Slide Indicator Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md">
                            {validImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIndex(idx);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        idx === selectedIndex
                                            ? 'w-6 bg-[#9A7236]'
                                            : 'w-2 bg-white/60 hover:bg-white'
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {validImages.map((imgObj, index) => (
                        <button
                            key={imgObj.id || imgObj.image || index}
                            className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                                selectedIndex === index
                                    ? 'border-[#9A7236] opacity-100 scale-105 shadow-md'
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
