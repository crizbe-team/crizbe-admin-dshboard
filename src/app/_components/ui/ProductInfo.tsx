'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Star, Loader2, ArrowRight, Flame, Clock } from 'lucide-react';
import { useAddToCart } from '@/queries/use-cart';
import { useRouter } from 'next/navigation';

interface ProductInfoProps {
    product: any; // Using any for now to match flexible backend data
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
    const { mutate: addToCart, isPending } = useAddToCart();

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'dec' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'inc') {
            const stockLimit = selectedVariant?.stock ?? Infinity;
            if (quantity < stockLimit) {
                setQuantity(quantity + 1);
            }
        }
    };

    const handleAddToCart = () => {
        if (!selectedVariant && product.variants?.length > 0) {
            alert('Please select a size');
            return;
        }

        const stockLimit = selectedVariant?.stock ?? 0;
        if (selectedVariant && quantity > stockLimit) {
            alert(`Sorry, only ${stockLimit} units available.`);
            return;
        }

        if (selectedVariant?.is_in_cart) {
            router.push('/cart');
            return;
        }

        addToCart({
            variant: selectedVariant?.id,
            product: product.id,
            quantity: quantity,
        });
    };

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(Number(currentPrice) || 0);

    const isInStock = selectedVariant
        ? selectedVariant.stock > 0 && selectedVariant.in_stock !== false
        : true;
    const isLowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock < 10;

    return (
        <div className="flex flex-col font-sans">
            {/* Brand / Category */}
            <span className="text-base text-[#5A5A5A] mb-1">
                {product.category?.name || 'Crizbe'}
            </span>

            {/* Title */}
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl font-bold text-[#1A1A1A] mb-3 leading-tight flex-1">
                    {product.name}
                </h1>
                {selectedVariant && (
                    <div className="flex flex-col items-end shrink-0 pt-2">
                        {selectedVariant.stock > 0 ? (
                            <span
                                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                                    isLowStock
                                        ? 'bg-orange-100 text-orange-600'
                                        : 'bg-green-100 text-green-600'
                                }`}
                            >
                                {isLowStock ? `Only ${selectedVariant.stock} left` : 'In Stock'}
                            </span>
                        ) : (
                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-red-100 text-red-600">
                                Out of Stock
                            </span>
                        )}
                    </div>
                )}
            </div>

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
                    <span className="font-semibold">
                        {Number(product.average_rating || 0).toFixed(1)}
                    </span>
                    <span>({product.total_reviews || 0} reviews)</span>
                </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-medium text-[#1A1A1A] mb-5">{formattedPrice}</div>

            {/* Low Stock Urgency Banner */}
            {isLowStock && (
                <div className="mb-7 overflow-hidden rounded-2xl border border-orange-200 bg-linear-to-r from-orange-50 via-amber-50 to-orange-50">
                    <div className="px-4 pt-3 pb-2 flex items-center gap-3">
                        {/* Pulsing dot */}
                        <span className="relative flex h-3 w-3 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-orange-800 leading-tight">
                                Almost gone! Only{' '}
                                <span className="text-orange-600">
                                    {selectedVariant.stock} item
                                    {selectedVariant.stock !== 1 ? 's' : ''}
                                </span>{' '}
                                left in stock
                            </p>
                            <p className="text-[11px] text-orange-600 mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Order soon before it sells out!
                            </p>
                        </div>
                    </div>
                    {/* Stock progress bar — fills based on how close to 0 */}
                    <div className="h-1.5 bg-orange-100">
                        <div
                            className="h-full bg-linear-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                            style={{
                                width: `${Math.min(100, (selectedVariant.stock / 10) * 100)}%`,
                            }}
                        />
                    </div>
                </div>
            )}

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
                                onClick={() => {
                                    setSelectedVariant(v);
                                    if (quantity > (v.stock || 0)) {
                                        setQuantity(Math.max(1, v.stock || 0));
                                    }
                                }}
                                className={`px-5 py-3 rounded-2xl cursor-pointer border text-sm font-semibold transition-all duration-300 ${
                                    selectedVariant?.id === v.id
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

            <div
                className={`mb-10 transition-opacity duration-300 ${!isInStock ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}
            >
                <div className="flex items-center justify-between mb-3 pr-2">
                    <h3 className="text-sm font-medium text-[#1A1A1A]">Quantity</h3>
                    {selectedVariant &&
                        quantity >= selectedVariant.stock &&
                        selectedVariant.stock > 0 && (
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">
                                Max stock reached
                            </span>
                        )}
                </div>
                <div className="flex items-center border border-[#8E8E8E] rounded-lg w-fit h-12 overflow-hidden">
                    <button
                        className="w-12 h-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-r border-[#8E8E8E] disabled:opacity-30"
                        onClick={() => handleQuantityChange('dec')}
                        disabled={quantity <= 1}
                    >
                        <Minus className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                    <span className="w-16 h-full flex items-center justify-center text-lg font-medium text-[#1A1A1A]">
                        {quantity < 10 ? `0${quantity}` : quantity}
                    </span>
                    <button
                        className="w-12 h-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-l border-[#8E8E8E] disabled:opacity-30"
                        onClick={() => handleQuantityChange('inc')}
                        disabled={selectedVariant && quantity >= selectedVariant.stock}
                    >
                        <Plus className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                </div>
            </div>

            {/* Status Messages */}
            {selectedVariant && !selectedVariant.in_stock && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-red-900">Restocking Soon!</p>
                        <p className="text-xs text-red-700 leading-relaxed">
                            We're sorry! This size is temporarily unavailable. We're working hard to
                            restock — check back in a few days or explore our other available sizes.
                        </p>
                    </div>
                </div>
            )}

            {/* Add to Cart */}
            <div className="relative group mb-8">
                <button
                    onClick={handleAddToCart}
                    disabled={isPending || !isInStock}
                    style={{
                        background: !isInStock
                            ? '#AFAFAF'
                            : 'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                    }}
                    className={`w-full relative overflow-hidden text-white text-base font-bold py-4 rounded-md flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_4px_20px_rgba(154,114,54,0.2)] active:scale-[0.98] ${
                        !isInStock ? 'cursor-not-allowed' : 'cursor-pointer'
                    } disabled:opacity-70`}
                >
                    {/* Shine Effect */}
                    {isInStock && (
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />
                    )}

                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : selectedVariant &&
                      !selectedVariant.in_stock ? null : selectedVariant?.is_in_cart ? (
                        <ArrowRight className="w-5 h-5" />
                    ) : (
                        <ShoppingCart className="w-5 h-5" />
                    )}
                    <span>
                        {isPending
                            ? 'Adding...'
                            : !isInStock
                              ? 'Out of Stock'
                              : selectedVariant?.is_in_cart
                                ? 'Go to Cart'
                                : 'Add to Cart'}
                    </span>
                </button>
            </div>

            <hr className="border-t border-dashed border-[#EAEAEA] mb-8" />
        </div>
    );
};

export default ProductInfo;
