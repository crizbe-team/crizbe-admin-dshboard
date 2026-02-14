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
        <div className="flex flex-col">
            {/* Brand / Category */}
            <span className="text-sm font-medium text-[#8E8E8E] mb-2 uppercase tracking-wider">
                {product.category?.name || 'Crizbe'}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4 font-serif">
                {product.name}
            </h1>

            {/* Reviews (Mock) */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex text-[#FFB800]">
                    {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4 fill-current opacity-50" />
                </div>
                <span className="text-sm text-[#5A5A5A]">(14 reviews)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-[#1A1A1A] mb-8">
                {formattedPrice}
            </div>
            {/* <div className="mb-8">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">Flavour</h3>
                <div className="flex gap-4">
                    {['Almond', 'Pistachio', 'Hazelnut'].map((flavour, i) => (
                        <button
                            key={i}
                            className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all ${i === 0 ? 'border-[#C19A5B]' : 'border-transparent opacity-60'}`}
                            title={flavour}
                        >
                            <div className="w-full h-full bg-gray-200"></div>
                            Use product image[0] as placeholder if available
                            <img src={product.images?.[0]?.image} className="object-cover w-full h-full" />
                        </button>
                    ))}
                </div>
            </div> */}

            {/* Quantity */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">Quantity</h3>
                <div className="flex items-center border border-[#EAEAEA] rounded-lg w-fit">
                    <button
                        className="p-3 hover:bg-gray-50 transition-colors"
                        onClick={() => handleQuantityChange('dec')}
                    >
                        <Minus className="w-4 h-4 text-[#5A5A5A]" />
                    </button>
                    <span className="w-12 text-center font-medium text-[#1A1A1A]">
                        {quantity < 10 ? `0${quantity}` : quantity}
                    </span>
                    <button
                        className="p-3 hover:bg-gray-50 transition-colors"
                        onClick={() => handleQuantityChange('inc')}
                    >
                        <Plus className="w-4 h-4 text-[#5A5A5A]" />
                    </button>
                </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full bg-[#C19A5B] hover:bg-[#A07E45] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform active:scale-[0.99] mb-8">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
            </button>

            <hr className="border-dashed border-[#EAEAEA] mb-8" />
        </div>
    );
};

export default ProductInfo;
