'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: { image: string }[];
    productName: string;
    productIcon?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName, productIcon }) => {
    const [selectedImage, setSelectedImage] = useState(images?.[0]?.image || null);

    // Update selected image if props change (e.g. initial load)
    React.useEffect(() => {
        if (images && images.length > 0 && !selectedImage) {
            setSelectedImage(images[0].image);
        }
    }, [images]);

    const displayImage = selectedImage || images?.[0]?.image;

    return (
        <div className="flex flex-col gap-6">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-[#F5F2EA] rounded-[32px] overflow-hidden shadow-sm group">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={productName}
                        className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                        {productIcon || '📦'}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images && images.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {/* Add the main image as the first thumbnail option if not explicitly in list, or just map existing */}
                    {images.map((img, index) => (
                        <button
                            key={index}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedImage === img.image
                                ? 'border-[#552C10] opacity-100'
                                : 'border-transparent opacity-80 hover:opacity-100'
                                }`}
                            onClick={() => setSelectedImage(img.image)}
                        >
                            <img
                                src={img.image}
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
