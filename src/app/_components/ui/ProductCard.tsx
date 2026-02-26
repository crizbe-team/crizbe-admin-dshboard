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
            className="rounded-[32px] flex flex-col h-full transition-shadow duration-300 cursor-pointer"
            onClick={handleClick}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-square mb-6 rounded-[24px] overflow-hidden bg-[#EAEAEA]">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                        {product.icon || '📦'}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                {/* Category */}
                <p className="font-[var(--font-bricolage)] font-normal text-[12px] leading-[16px] text-[#AFAFAF] mb-2 uppercase align-middle">
                    {product.category?.name || 'Uncategorized'}
                </p>

                {/* Title */}
                <h3 className="font-[var(--font-inter-tight)] font-semibold text-[16px] leading-[150%] mb-2 line-clamp-2 align-middle">
                    {product.name}
                </h3>

                {/* Price */}
                <p className="font-[var(--font-inter-tight)] font-semibold text-[16px] leading-[150%] mb-6 align-middle">
                    {formattedPrice}
                </p>

                {/* Add to Cart Button */}
                <button
                    className="w-full py-[12px] px-[24px] rounded-[12px] border border-[#000] font-medium text-[14px] hover:bg-white hover:text-[#373737] transition-all duration-300 flex items-center justify-center gap-[8px]"
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