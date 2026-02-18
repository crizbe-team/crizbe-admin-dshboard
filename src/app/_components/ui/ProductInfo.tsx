'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';

interface ProductInfoProps {
    product: any; // Using any for now to match flexible backend data
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'dec' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'inc') {
            setQuantity(quantity + 1);
        }
    };

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(Number(product.price) || 0);

    return (
        <div className="flex flex-col font-sans">
            {/* Brand / Category */}
            <span className="text-base text-[#5A5A5A] mb-1">
                {product.category?.name || 'Crizbe'}
            </span>

            {/* Title */}
            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-3 leading-tight">
                {product.name}
            </h1>

            {/* Reviews (Mock) */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex text-[#FFB800] gap-0.5">
                    {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                    <Star className="w-5 h-5 fill-current text-gray-300" />
                </div>
                <div className="flex items-center gap-2 text-sm text-[#5A5A5A] ml-2">
                    <span className="font-semibold">4.5</span>
                    <span>(14 reviews)</span>
                </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-medium text-[#1A1A1A] mb-8">
                {formattedPrice}
            </div>

            {/* Flavour Mock */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Flavour</h3>
                <div className="flex gap-4">
                    {/* Try to use product images as flavour thumbnails if available, else placeholders */}
                    {['Almond', 'Pistachio', 'Dark Choco'].map((flavour, i) => (
                        <button
                            key={i}
                            className={`group relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 ${i === 0 ? 'ring-2 ring-[#552C10] ring-offset-2' : 'hover:opacity-80'}`}
                            title={flavour}
                        >
                            <img
                                src={product.images?.[i]?.image || product.images?.[0]?.image}
                                className="w-full h-full object-cover"
                                alt={flavour}
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                            {/* Overlay for unselected? Maybe not needed based on screenshot which just shows selection ring */}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity */}
            <div className="mb-10">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Quantity</h3>
                <div className="flex items-center border border-[#8E8E8E] rounded-lg w-fit h-12">
                    <button
                        className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-[#8E8E8E]"
                        onClick={() => handleQuantityChange('dec')}
                    >
                        <Minus className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                    <span className="w-16 h-full flex items-center justify-center text-lg font-medium text-[#1A1A1A]">
                        {quantity < 10 ? `0${quantity}` : quantity}
                    </span>
                    <button
                        className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-[#8E8E8E]"
                        onClick={() => handleQuantityChange('inc')}
                    >
                        <Plus className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full bg-[#C19A5B] hover:bg-[#A6854E] text-white text-base font-medium py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-sm active:scale-[0.99] mb-8">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
            </button>

            <hr className="border-t border-dashed border-[#EAEAEA] mb-8" />
        </div>
    );
};

export default ProductInfo;
