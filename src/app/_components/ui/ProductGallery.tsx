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
            <div className="relative w-full aspect-square bg-[#F5F2EA] rounded-3xl overflow-hidden shadow-sm">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={productName}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                        {productIcon || '📦'}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images && images.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === img.image
                                    ? 'border-[#C19A5B] opacity-100'
                                    : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                            onClick={() => setSelectedImage(img.image)}
                        >
                            <img
                                src={img.image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
