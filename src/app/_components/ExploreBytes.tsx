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

    // Create exactly 8 products for the grid, padding with realistic fallback mock products
    const displayProducts = useMemo(() => {
        const list = [...apiProducts];

        const fallbacks = [
            {
                id: 'mock-1',
                slug: 'crizbe-almond-crunch-sticks',
                name: 'Crizbe Almond Crunch Sticks',
                price: 1999,
                images: [{ image: '/images/user/almond-bottle.png' }],
                category: { name: 'Almond' },
                variants: [{ id: 'mock-v-1', size: '200g', price: 1999, in_stock: true, stock: 10 }]
            },
            {
                id: 'mock-2',
                slug: 'crizbe-pista-crunch-sticks',
                name: 'Crizbe Pista Crunch Sticks',
                price: 1999,
                images: [{ image: '/images/user/pista-bottle.png' }],
                category: { name: 'Pistachio' },
                variants: [{ id: 'mock-v-2', size: '200g', price: 1999, in_stock: true, stock: 10 }]
            },
            {
                id: 'mock-3',
                slug: 'crizbe-hazelnut-crunch-sticks',
                name: 'Crizbe Hazelnut Crunch Sticks',
                price: 1999,
                images: [{ image: '/images/user/hazelnut-bottle.png' }],
                category: { name: 'Hazelnut' },
                variants: [{ id: 'mock-v-3', size: '200g', price: 1999, in_stock: true, stock: 10 }]
            },
            {
                id: 'mock-4',
                slug: 'crizbe-premium-almond-sticks',
                name: 'Crizbe Premium Almond Sticks',
                price: 1999,
                images: [{ image: '/images/user/almond-bottle.png' }],
                category: { name: 'Almond' },
                variants: [{ id: 'mock-v-4', size: '200g', price: 1999, in_stock: true, stock: 10 }]
            },
            {
                id: 'mock-5',
                slug: 'crizbe-premium-pista-sticks',
                name: 'Crizbe Premium Pista Sticks',
                price: 1999,
                images: [{ image: '/images/user/pista-bottle.png' }],
                category: { name: 'Pistachio' },
                variants: [{ id: 'mock-v-5', size: '200g', price: 1999, in_stock: true, stock: 10 }]
            },
            {
                id: 'mock-6',
                slug: 'crizbe-premium-hazelnut-sticks',
                name: 'Crizbe Premium Hazelnut Sticks',
                price: 1999,
                images: [{ image: '/images/user/hazelnut-bottle.png' }],
                category: { name: 'Hazelnut' },
                variants: [{ id: 'mock-v-6', size: '200g', price: 1999, in_stock: true, stock: 10 }]
            },
            {
                id: 'mock-7',
                slug: 'crizbe-crunch-sticks-almond-pack',
                name: 'Crizbe Crunch Sticks - Almond',
                price: 1999,
                images: [{ image: '/images/user/almond-bottle.png' }],
                category: { name: 'Almond' },
                variants: [{ id: 'mock-v-7', size: '200g', price: 1999, in_stock: true, stock: 10 }]
            },
            {
                id: 'mock-8',
                slug: 'crizbe-crunch-sticks-pista-pack',
                name: 'Crizbe Crunch Sticks - Pista',
                price: 1999,
                images: [{ image: '/images/user/pista-bottle.png' }],
                category: { name: 'Pistachio' },
                variants: [{ id: 'mock-v-8', size: '200g', price: 1999, in_stock: true, stock: 10 }]
            }
        ];

        while (list.length < 8) {
            const fallbackItem = fallbacks[list.length % fallbacks.length];
            list.push({
                ...fallbackItem,
                id: `${fallbackItem.id}-${Math.floor(list.length / fallbacks.length)}`
            });
        }

        return list.slice(0, 8);
    }, [apiProducts]);

    const handleAddToCart = (product: any, e: React.MouseEvent) => {
        e.stopPropagation();

        setAddingProductId(product.id);

        // Simulated success block for mock/fallback products
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
        <section className="explore-bytes-section rounded-[32px] pt-28 md:pt-36 pb-20 px-6 md:px-12 bg-white relative z-10 -translate-y-7">
            <div className="wrapper ">
                {/* Title */}
                <h2 className="text-center font-bricolage text-[#4E3325] text-[36px] md:text-[48px] font-bold leading-tight mb-12">
                    Explore our Crizbe Bytes
                </h2>

                {/* Product Grid */}
                {isProductsLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C4994A]" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {displayProducts.map((product: any) => {
                            const imageUrl = product.images?.[0]?.image || '/placeholder-image.png';

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => router.push(`/products/${product.slug}`)}
                                    className="group flex flex-col h-full cursor-pointer"
                                >
                                    {/* Image Container with Olive background */}
                                    <div className="relative w-full aspect-square mb-4 rounded-[20px] overflow-hidden bg-[#7C7C44] flex items-center justify-center p-6 transition-all duration-300 group-hover:shadow-md">
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            className="object-contain w-full h-full max-h-[85%] scale-90 group-hover:scale-95 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Info Block: Name & Price */}
                                    <div className="flex justify-between items-start gap-3 mb-4 px-1">
                                        <h3 className="font-inter-tight font-semibold text-[16px] leading-[140%] text-[#191919] line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <span className="font-inter-tight font-semibold text-[16px] leading-[140%] text-[#191919] whitespace-nowrap">
                                            {isCurrencyLoading ? '...' : convertPrice(product.price)}
                                        </span>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <div className="mt-auto">
                                        <AuthActionWrapper>
                                            <button
                                                onClick={(e) => handleAddToCart(product, e)}
                                                disabled={addingProductId === product.id}
                                                className="w-full h-[44px] rounded-[12px] bg-[#191919] text-white flex items-center justify-center gap-[8px] font-inter-tight font-medium text-[15px] hover:bg-[#333333] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                                            >
                                                {addingProductId === product.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                                ) : (
                                                    <ShoppingCart className="w-5 h-5" />
                                                )}
                                                <span>Add to cart</span>
                                            </button>
                                        </AuthActionWrapper>
                                    </div>
                                </div>
                            );
                        })}
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
