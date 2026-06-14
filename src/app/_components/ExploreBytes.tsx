'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useFetchProducts } from '@/queries/use-products';
import { useAddToCart } from '@/queries/use-cart';
import { useCartToast } from '@/contexts/CartToastContext';
import AuthActionWrapper from '@/components/AuthActionWrapper';
import { useCurrency } from '@/contexts/CurrencyContext';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: any;
    index: number;
    convertPrice: (price: number) => string;
    isCurrencyLoading: boolean;
    addingProductId: string | null;
    handleAddToCart: (product: any, e: React.MouseEvent) => void;
}

function ProductCard({
    product,
    index,
    convertPrice,
    isCurrencyLoading,
    addingProductId,
    handleAddToCart,
}: ProductCardProps) {
    const router = useRouter();
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
            onClick={() => router.push(`/products/${product.slug}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group border-[#E6E6E6] border overflow-hidden flex flex-col h-full w-[370px] rounded-[28px] bg-[#FCFAF4] transition-all duration-300 hover:shadow-md cursor-pointer relative"
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
                                className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                                    i === currentImageIndex ? 'bg-white opacity-100' : 'bg-white/30'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-[20px] bg-[#fff]">
                <div className="flex justify-between items-start gap-3 mb-5 ">
                    <h3 className="font-inter-tight font-semibold text-[16px] leading-[140%] text-[#191919] line-clamp-2">
                        {product.name}
                    </h3>
                    <span className="font-inter-tight font-semibold text-[16px] leading-[140%] text-[#191919] whitespace-nowrap">
                        {isCurrencyLoading ? '...' : convertPrice(product.price)}
                    </span>
                </div>

                {/* Add to Cart Button (Capsule, left-aligned) */}
                <div className="mt-auto px-1">
                    <AuthActionWrapper>
                        <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={addingProductId === product.id}
                            className="w-fit h-[40px] px-5 rounded-full bg-[#4E3325] text-white flex items-center justify-center gap-[8px] font-inter-tight font-medium text-[14px] hover:bg-[#3D281D] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                        >
                            {addingProductId === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : (
                                <ShoppingCart className="w-4 h-4" />
                            )}
                            <span>Add to cart</span>
                        </button>
                    </AuthActionWrapper>
                </div>
            </div>
        </motion.div>
    );
}

export default function ExploreBytes() {
    const router = useRouter();
    const { convertPrice, isLoading: isCurrencyLoading } = useCurrency();
    const { mutate: addToCart } = useAddToCart();
    const { showToast } = useCartToast();

    // Fetch products from server
    const { data: productsData, isLoading: isProductsLoading } = useFetchProducts();
    const apiProducts = productsData?.data || [];

    // State to track which product is being added to cart (shows spinner)
    const [addingProductId, setAddingProductId] = useState<string | null>(null);

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

        setAddingProductId(product.id);

        // Simulated success block for mock/fallback products if any exist
        if (String(product.id).startsWith('mock-')) {
            setTimeout(() => {
                showToast({
                    name: product.name,
                    image: product.images?.[0]?.image || '/placeholder-image.png',
                    weight: product.variants?.[0]?.size || '200g',
                    qty: 1,
                });
                setAddingProductId(null);
            }, 600);
            return;
        }

        // Live API call for real products
        const defaultVariant = product.variants?.[0]?.id;
        addToCart(
            {
                product: product.id,
                variant: defaultVariant,
                quantity: 1,
            },
            {
                onSuccess: () => {
                    showToast({
                        name: product.name,
                        image: product.images?.[0]?.image || product.image,
                        weight: product.variants?.[0]?.size || 'Standard',
                        qty: 1,
                    });
                    setAddingProductId(null);
                },
                onError: () => {
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
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {apiProducts.map((product: any, index: number) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                convertPrice={convertPrice}
                                isCurrencyLoading={isCurrencyLoading}
                                addingProductId={addingProductId}
                                handleAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="mt-16 flex justify-center">
                    <button
                        onClick={() => router.push('/products')}
                        className="font-inter-tight font-semibold text-[16px] text-[#8E8E8E] hover:text-[#4E3325] transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                    >
                        View all <span className="text-lg">→</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
