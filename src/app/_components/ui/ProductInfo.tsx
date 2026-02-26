'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';

interface ProductInfoProps {
    product: any; // Using any for now to match flexible backend data
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'dec' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'inc') {
            setQuantity(quantity + 1);
        }
    };

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(Number(currentPrice) || 0);

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

            {/* Reviews */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex text-[#FFB800] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 fill-current ${i < Math.floor(product.average_rating || 0) ? 'text-[#FFB800]' : 'text-gray-300'}`}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#5A5A5A] ml-2">
                    <span className="font-semibold">{Number(product.average_rating || 0).toFixed(1)}</span>
                    <span>({product.total_reviews || 0} reviews)</span>
                </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-medium text-[#1A1A1A] mb-8">
                {formattedPrice}
            </div>

            {/* Flavour Mock */}
            {/* <div className="mb-8">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Flavour</h3>
                <div className="flex gap-4">
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
                        </button>
                    ))}
                </div>
            </div> */}

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Select Size</h3>
                    <div className="flex flex-wrap gap-4">
                        {product.variants.map((v: any) => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                className={`px-5 py-3 rounded-2xl border text-sm font-semibold transition-all duration-300 ${selectedVariant?.id === v.id
                                    ? 'border-[#552C10] bg-[#552C10] text-white shadow-md transform scale-105'
                                    : 'border-[#EAEAEA] bg-white text-[#5A5A5A] hover:border-[#C19A5B] hover:bg-gray-50'
                                    }`}
                            >
                                {v.size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

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
            <div className="relative group mb-8">
                <button
                    style={{
                        background: 'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)'
                    }}
                    className="w-full relative overflow-hidden text-white text-base font-bold py-4 rounded-md flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_4px_20px_rgba(154,114,54,0.2)] active:scale-[0.98] cursor-pointer"
                >
                    {/* Shine Effect */}
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />

                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                </button>
            </div>

            <hr className="border-t border-dashed border-[#EAEAEA] mb-8" />
        </div>
    );
};

export default ProductInfo;
