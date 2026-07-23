'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Loader2, ArrowRight } from 'lucide-react';
import { useFetchProducts } from '@/queries/use-products';
import { useAddToCart } from '@/queries/use-cart';
import { useCartToast } from '@/contexts/CartToastContext';
import AuthActionWrapper from '@/components/AuthActionWrapper';
import { useCurrency } from '@/contexts/CurrencyContext';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/Toast';

interface ProductCardProps {
    product: any;
    index: number;
    convertPrice: (price: number) => string;
    isCurrencyLoading: boolean;
    addingProductId: string | null;
    addedToCartProductIds: Set<string>;
    handleAddToCart: (product: any, e: React.MouseEvent) => void;
}

function ProductCard({
    product,
    index,
    convertPrice,
    isCurrencyLoading,
    addingProductId,
    addedToCartProductIds,
    handleAddToCart,
}: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = useMemo(() => {
        return product.images && product.images.length > 0
            ? product.images
            : [{ image: '/placeholder-image.png' }];
    }, [product.images]);

    // Slideshow loop when user hovers the card
    useEffect(() => {
        if (!isHovered || images.length <= 1) {
            setCurrentImageIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 1500);

        return () => clearInterval(interval);
    }, [isHovered, images]);

    const defaultVariant = product.variants?.[0];
    const hasVariants = product.variants && product.variants.length > 0;
    const isInStock = hasVariants
        ? defaultVariant && defaultVariant.stock > 0 && defaultVariant.in_stock !== false
        : false;
    const isAdding = addingProductId === product.id;
    const isInCart = defaultVariant?.is_in_cart || addedToCartProductIds.has(String(product.id));
    const buttonLabel = !hasVariants
        ? 'Coming Soon'
        : !isInStock
            ? 'Out of Stock'
            : 'Add to cart';

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group border-[#E6E6E6] border overflow-hidden flex flex-col h-full w-[350px] rounded-[28px] bg-[#FCFAF4] transition-all duration-300 hover:shadow-md relative"
        >
            <Link
                href={`/products/${product.slug}`}
                className="flex flex-col flex-grow cursor-pointer"
            >
                {/* Image Container */}
                <div className="relative w-full h-[320px] overflow-hidden transition-all duration-300">
                    <img
                        src={images[currentImageIndex]?.image}
                        alt={product.name}
                        className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Horizontal Indicators for Multiple Images (visible on hover) */}
                    {images.length > 1 && (
                        <div
                            className={`absolute bottom-3 left-4 right-4 flex gap-1.5 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {images.map((_: any, i: any) => (
                                <div
                                    key={i}
                                    className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${i === currentImageIndex
                                        ? 'bg-white opacity-100'
                                        : 'bg-white/30'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-[20px] pb-0 bg-[#fff] flex-grow">
                    <div className="flex justify-between items-start gap-3">
                        <h3 className="font-inter-tight font-semibold text-[16px] leading-[140%] text-[#191919] line-clamp-2">
                            {product.name}
                        </h3>
                        <span className="font-inter-tight font-semibold text-[16px] leading-[140%] text-[#191919] whitespace-nowrap">
                            {isCurrencyLoading ? '...' : convertPrice(product.price)}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button (Capsule, left-aligned) - OUTSIDE the Link to avoid nested anchors */}
            <div className="p-[20px] pt-5 bg-[#fff] mt-auto">
                <div className="px-1">
                    <AuthActionWrapper>
                        {isInCart ? (
                            <Link
                                href="/checkout/cart"
                                className="w-fit h-[40px] px-5 rounded-full bg-[#4E3325] text-white flex items-center justify-center gap-[8px] font-inter-tight font-medium text-[14px] hover:bg-[#3D281D] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                            >
                                <ArrowRight className="w-4 h-4" />
                                <span>Go to Cart</span>
                            </Link>
                        ) : (
                            <button
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={isAdding || !hasVariants || !isInStock}
                                className="relative overflow-hidden w-fit h-[40px] px-5 rounded-full bg-[#4E3325] text-white flex items-center justify-center gap-2 font-inter-tight font-medium text-[14px] hover:bg-[#3D281D] active:scale-95 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                            >
                                <ShoppingCart className="w-4 h-4 shrink-0" />
                                <span>{buttonLabel}</span>
                                {isAdding && (
                                    <span
                                        aria-hidden
                                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-b-full"
                                    >
                                        <motion.span
                                            className="absolute top-0 h-full w-1/3 bg-white"
                                            initial={{ left: '-33%' }}
                                            animate={{ left: ['-33%', '100%'] }}
                                            transition={{
                                                duration: 1,
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
            </div>
        </motion.div>
    );
}

export default function ExploreBytes() {
    const { convertPrice, isLoading: isCurrencyLoading } = useCurrency();
    const { mutate: addToCart } = useAddToCart();
    const { showToast } = useCartToast();

    // Fetch products from server
    const { data: productsData, isLoading: isProductsLoading } = useFetchProducts();
    const apiProducts = productsData?.data || [];

    // State to track which product is being added to cart (shows spinner)
    const [addingProductId, setAddingProductId] = useState<string | null>(null);
    const [addedToCartProductIds, setAddedToCartProductIds] = useState<Set<string>>(new Set());

    // Refresh Locomotive Scroll & GSAP ScrollTrigger when products are loaded
    useEffect(() => {
        if (!isProductsLoading) {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);
        }
    }, [isProductsLoading, apiProducts.length]);

    const handleAddToCart = (product: any, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const defaultVariant = product.variants?.[0];
        const hasVariants = product.variants && product.variants.length > 0;
        const isInStock = hasVariants
            ? defaultVariant && defaultVariant.stock > 0 && defaultVariant.in_stock !== false
            : false;

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

        setAddingProductId(product.id);

        // Simulated success block for mock/fallback products if any exist
        if (String(product.id).startsWith('mock-')) {
            setTimeout(() => {
                showToast({
                    name: product.name,
                    image: product.images?.[0]?.image || '/placeholder-image.png',
                    weight: defaultVariant?.size || 'Standard',
                    qty: 1,
                });
                setAddedToCartProductIds((prev) => new Set(prev).add(String(product.id)));
                setAddingProductId(null);
            }, 600);
            return;
        }

        // Live API call for real products
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
                        image:
                            product.images?.[0]?.image || product.image || '/placeholder-image.png',
                        weight: defaultVariant?.size || 'Standard',
                        qty: 1,
                    });
                    setAddedToCartProductIds((prev) => new Set(prev).add(String(product.id)));
                    setAddingProductId(null);
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to add item to cart');
                    setAddingProductId(null);
                },
            }
        );
    };

    return (
        <section className="explore-bytes-section rounded-t-[32px] pt-28 md:pt-36 pb-20 px-6 md:px-12 bg-white relative z-10 -mt-7">
            <div className="wrapper ">
                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center font-bricolage text-[#4E3325] text-[36px] md:text-[48px] font-bold leading-tight mb-12"
                >
                    Explore our Crizbe Bytes
                </motion.h2>

                {/* Product Grid */}
                {isProductsLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C4994A]" />
                    </div>
                ) : !apiProducts || apiProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4 max-w-md mx-auto">
                        <div className="w-16 h-16 bg-[#FAF3E2] rounded-full flex items-center justify-center mb-6">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h3 className="font-bricolage text-[#4E3325] text-xl font-bold mb-2">
                            Fresh Crizbe Bytes on the Way!
                        </h3>
                        <p className="text-[#4E3325]/70 text-sm leading-relaxed">
                            We are currently crafting our next batch of premium crunch sticks. Savor the expectation and check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-between gap-x-3 gap-y-10">
                        {apiProducts?.map((product: any, index: number) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                convertPrice={convertPrice}
                                isCurrencyLoading={isCurrencyLoading}
                                addingProductId={addingProductId}
                                addedToCartProductIds={addedToCartProductIds}
                                handleAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/products"
                        className="font-inter-tight font-semibold text-[16px] text-[#8E8E8E] hover:text-[#4E3325] transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                    >
                        View all <span className="text-lg">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
