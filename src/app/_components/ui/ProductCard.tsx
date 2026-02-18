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
            className="rounded-3xl p-4 flex flex-col h-full transition-shadow duration-300 cursor-pointer mt-10"
            onClick={handleClick}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-[#EAEAEA]">
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
                <p className="text-xs text-[#8E8E8E] font-medium mb-1 uppercase tracking-wide">
                    {product.category?.name || 'Uncategorized'}
                </p>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                {/* Price */}
                <p className="text-lg font-bold text-[#1A1A1A] mb-4">
                    {formattedPrice}
                </p>

                {/* Add to Cart Button */}
                <button
                    className="w-full py-2.5 px-4 rounded-xl border border-[#3E3E3E] text-[#3E3E3E] font-medium hover:bg-[#3E3E3E] hover:text-[#FAF9F6] transition-colors duration-300"
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