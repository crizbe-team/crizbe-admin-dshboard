'use client';

import React from 'react';
import Link from 'next/link';
import { useAddToCart } from '@/queries/use-cart';
import { useCartToast } from '@/contexts/CartToastContext';
import AuthActionWrapper from '@/components/AuthActionWrapper';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/Toast';

interface Product {
    id: string;
    slug: string;
    name: string;
    category?: {
        name: string;
    };
    price: string | number;
    images?: { image: string }[];
    icon?: string;
    variants?: any[];
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { mutate: addToCart, isPending } = useAddToCart();
    const { showToast } = useCartToast();

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(Number(product.price) || 0);

    const imageUrl = product.images?.[0]?.image || '/placeholder-image.png';

    const defaultVariant = product.variants?.[0];
    const hasVariants = product.variants && product.variants.length > 0;
    const isInStock = hasVariants
        ? defaultVariant && defaultVariant.stock > 0 && defaultVariant.in_stock !== false
        : false;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!hasVariants) {
            toast.error('This product is coming soon and cannot be added to cart.');
            return;
        }

        if (!defaultVariant) {
            toast.error('No variant is available for this product.');
            return;
        }

        if (!isInStock) {
            toast.error('This variant is currently out of stock.');
            return;
        }

        addToCart(
            {
                product: product.id,
                variant: defaultVariant?.id,
                quantity: 1,
            },
            {
                onSuccess: () => {
                    showToast({
                        name: product.name,
                        image: imageUrl,
                        weight: defaultVariant?.size || 'Standard',
                        qty: 1,
                    });
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to add item to cart');
                },
            }
        );
    };

    return (
        <div className="flex flex-col h-full transition-shadow duration-300">
            <Link
                href={`/products/${product.slug}`}
                className="flex flex-col flex-grow group cursor-pointer"
            >
                {/* Image Container */}
                <div className="relative w-full aspect-square mb-[16px] rounded-[12px] overflow-hidden bg-[#7C7C44]">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
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
                </div>
            </Link>

            {/* Add to Cart Button wrapper (outside the Link to prevent nested anchor tags) */}
            <AuthActionWrapper>
                {defaultVariant?.is_in_cart ? (
                    <Link
                        href="/checkout/cart"
                        className="w-full max-w-full h-[44px] py-[12px] px-[24px] rounded-[12px] border border-[#4E3325] flex items-center justify-center gap-[8px] font-inter-tight font-normal text-[16px] leading-[150%] text-[#4E3325] hover:bg-[#4E3325] hover:text-white transition-all duration-300 cursor-pointer"
                    >
                        Go to Cart
                    </Link>
                ) : (
                    <button
                        className={`relative overflow-hidden w-full max-w-full h-[44px] py-[12px] px-[24px] rounded-[12px] border border-[#4E3325] flex items-center justify-center gap-[8px] font-inter-tight font-normal text-[16px] leading-[150%] transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${
                            isPending
                                ? 'bg-[#4E3325] text-white disabled:opacity-100'
                                : 'text-[#4E3325] hover:bg-[#4E3325] hover:text-white disabled:opacity-60'
                        }`}
                        onClick={handleAddToCart}
                        disabled={isPending || !hasVariants || !isInStock}
                    >
                        <span>
                            {!hasVariants
                                ? 'Coming Soon'
                                : !isInStock
                                    ? 'Out of Stock'
                                    : 'Add to cart'}
                        </span>
                        {isPending && (
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-b-[12px]"
                            >
                                <motion.span
                                    className="absolute top-0 h-full w-6 bg-white"
                                    initial={{ left: '-1.5rem' }}
                                    animate={{ left: ['-1.5rem', '100%'] }}
                                    transition={{
                                        duration: 0.9,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </span>
                        )}
                    </button>
                )}
            </AuthActionWrapper>
        </div>
    );
};

export default ProductCard;
