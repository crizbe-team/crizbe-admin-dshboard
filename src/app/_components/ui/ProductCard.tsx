'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    category?: {
        name: string;
    };
    price: string | number;
    images?: { image: string }[];
    icon?: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const router = useRouter();

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(Number(product.price) || 0);

    const imageUrl = product.images?.[0]?.image || '/placeholder-image.png';

    const handleClick = () => {
        router.push(`/products/${product.id}`);
    };

    return (
        <div
            className="flex flex-col h-full transition-shadow duration-300 cursor-pointer"
            onClick={handleClick}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-square mb-[16px] rounded-[12px] overflow-hidden bg-[#7C7C44]">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-white/50">
                        {product.icon || '📦'}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                {/* Category */}
                <p className="font-bricolage font-normal text-[12px] leading-[16px] text-[#747474] mb-2">
                    {product.category?.name || 'Category'}
                </p>

                {/* Title */}
                <h3 className="font-inter-tight font-semibold text-[18px] leading-[150%] text-[#191919]  line-clamp-1">
                    {product.name}
                </h3>

                {/* Price */}
                <p className="font-inter-tight font-semibold text-[16px] leading-[150%] text-[#373737] mb-[16px]">
                    {formattedPrice}
                </p>

                {/* Add to Cart Button */}
                <button
                    className="w-full max-w-full h-[44px] py-[12px] px-[24px] rounded-[12px] border border-[#4E3325] flex items-center justify-center gap-[8px] font-inter-tight font-normal text-[16px] leading-[150%] text-[#4E3325] hover:bg-[#4E3325] hover:text-white transition-all duration-300 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart logic here
                    }}
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;