'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ModalWrapper } from '@/components/ui/ModalWrapper';

interface ProductGalleryProps {
    images: { id?: string | number; image: string }[];
    productName: string;
    productIcon?: string;
}

const GRID_LIMIT = 4;

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName, productIcon }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const validImages = useMemo(() => {
        return images && images.length > 0 ? images.filter((img) => img?.image) : [];
    }, [images]);

    const imagesKey = useMemo(() => {
        return validImages.map((img) => img.id || img.image).join(',');
    }, [validImages]);

    const gridImages = validImages.slice(0, GRID_LIMIT);
    const extraCount = Math.max(0, validImages.length - GRID_LIMIT);

    useEffect(() => {
        setSelectedIndex(0);
        setLightboxOpen(false);
    }, [imagesKey]);

    useEffect(() => {
        validImages.forEach((imgObj) => {
            if (imgObj?.image) {
                const img = new Image();
                img.src = imgObj.image;
            }
        });
    }, [validImages]);

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
        setLightboxOpen(true);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % validImages.length);
    };

    const currentImage = validImages[selectedIndex];

    if (validImages.length === 0) {
        return (
            <div className="w-full aspect-square bg-[#FAF6EE] border border-[#E8E8E8] rounded-xl overflow-hidden flex items-center justify-center text-6xl text-gray-300">
                {productIcon || '📦'}
            </div>
        );
    }

    return (
        <>
            <div
                className={`grid gap-2 sm:gap-2.5 ${
                    validImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}
            >
                {gridImages.map((imgObj, index) => {
                    const isLastVisible = index === gridImages.length - 1 && extraCount > 0;

                    return (
                        <button
                            key={imgObj.id || imgObj.image || index}
                            type="button"
                            onClick={() => openLightbox(index)}
                            className="relative w-full aspect-square overflow-hidden rounded-xl bg-[#F5F5F5] border border-[#EFEFEF] cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7236] focus-visible:ring-offset-2"
                            aria-label={
                                isLastVisible
                                    ? `View ${extraCount} more images of ${productName}`
                                    : `View ${productName} image ${index + 1}`
                            }
                        >
                            <img
                                src={imgObj.image}
                                alt={`${productName} - View ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {isLastVisible && (
                                <span className="absolute inset-0 bg-black/45 flex items-center justify-center text-white font-bricolage text-2xl sm:text-3xl font-semibold tracking-wide">
                                    +{extraCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <ModalWrapper open={lightboxOpen} onClose={() => setLightboxOpen(false)}>
                <div className="relative w-[min(92vw,920px)] max-h-[88vh] bg-[#FCFAF4] rounded-2xl overflow-hidden shadow-xl">
                    <div className="relative w-full aspect-square max-h-[88vh] bg-[#FAF6EE]">
                        {currentImage?.image && (
                            <img
                                src={currentImage.image}
                                alt={`${productName} - View ${selectedIndex + 1}`}
                                className="w-full h-full object-contain"
                            />
                        )}

                        {validImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#4E3325] shadow-md flex items-center justify-center transition-transform duration-200 hover:scale-105"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#4E3325] shadow-md flex items-center justify-center transition-transform duration-200 hover:scale-105"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {validImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none bg-[#FCFAF4] border-t border-[#EADBBD]/40">
                            {validImages.map((imgObj, index) => (
                                <button
                                    key={imgObj.id || imgObj.image || index}
                                    type="button"
                                    onClick={() => setSelectedIndex(index)}
                                    className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-opacity duration-200 ${
                                        selectedIndex === index
                                            ? 'border-[#9A7236] opacity-100'
                                            : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                                    aria-label={`Select image ${index + 1}`}
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
            </ModalWrapper>
        </>
    );
};

export default ProductGallery;
