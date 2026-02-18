'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchSingleProduct, useFetchProducts } from '@/queries/use-products';
import Loader from '@/components/ui/loader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGallery from '@/app/_components/ui/ProductGallery';
import ProductInfo from '@/app/_components/ui/ProductInfo';
import AccordionItem from '@/components/ui/Accordion';
import ProductCard from '@/app/_components/ui/ProductCard';
import { ArrowLeft, Star } from 'lucide-react';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const productId = Array.isArray(id) ? id[0] : id;

    const { data: productData, isLoading, isError } = useFetchSingleProduct(productId || '');
    const { data: relatedProductsData } = useFetchProducts({ limit: 4 }); // Mock limit, adjust if API supports
    console.log(productData, "productData");
    const product = productData;
    const relatedProducts = relatedProductsData?.data?.slice(0, 4) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader />
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 mx-auto text-purple-600 hover:text-purple-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: product.name },
    ];

    return (
        <div className="wrapper py-8 md:py-12 mt-[100px]">
            <div className="mb-8">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
                {/* Left Column: Gallery */}
                <div className="lg:col-span-7">
                    <div className="sticky top-24">
                        <ProductGallery
                            images={product.images || []}
                            productName={product.name}
                            productIcon={product.icon}
                        />
                    </div>
                </div>

                {/* Right Column: Info */}
                <div className="lg:col-span-5">
                    <ProductInfo product={product} />

                    <div className="space-y-6 mt-10">
                        {/* About the product - Styled as per screenshot "About the product" with a small line on right? Screenshot shows "-" (minus) icon typically for open accordion */}
                        <AccordionItem title="About the product" defaultOpen={true}>
                            {/* Screenshot text: "Crizbe Crunch Sticks are the perfect snack... just pure, delightful crunchiness." */}
                            <div className="text-sm text-[#5A5A5A] leading-relaxed">
                                <p>
                                    Crizbe Crunch Sticks are the perfect snack for those who appreciate a moment of quiet indulgence. Each bite delivers a satisfying deep crunch, complemented by the rich flavor of real nuts. Enjoy a snack that feels just right, without any fuss or drama—just pure, delightful crunchiness.
                                </p>
                            </div>
                        </AccordionItem>

                        {/* Ratings & Reviews - Match screenshot */}
                        <AccordionItem title="Ratings & Reviews">
                            <div className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Left: Overall Rating */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <Star className="w-10 h-10 fill-[#2ECC71] text-[#2ECC71]" />
                                            <span className="text-5xl font-bold text-[#2ECC71]">4.5</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">130 ratings & 28 reviews</p>
                                    </div>
                                    {/* Right: Progress Bars */}
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Excellent', val: '80%', count: 365 },
                                            { label: 'Very good', val: '60%', count: 199 },
                                            { label: 'Good', val: '5%', count: 2 },
                                            { label: 'Average', val: '0%', count: 0 },
                                            { label: 'Poor', val: '0%', count: 0 }
                                        ].map((r, i) => (
                                            <div key={i} className="flex items-center gap-4 text-xs">
                                                <span className="w-16 text-gray-600">{r.label}</span>
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#2ECC71]" style={{ width: r.val }}></div>
                                                </div>
                                                <span className="w-8 text-right text-gray-400">{r.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Customer Reviews Box style */}
                                <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
                                    <h3 className="font-bold text-[#1A1A1A] mb-6">Customers Reviews</h3>

                                    {/* Review Item */}
                                    <div className="space-y-6">
                                        {[
                                            { name: 'Katie Sims', time: '1 month ago', text: 'Excellent product!!', body: 'I recently tried the Crizbe Crunch stick in almond flavor, and I was pleasantly surprised! Priced at around 319, it offers a unique taste that stands out among other snacks.' },
                                            { name: 'Chris Glasser', time: '1 month ago', text: 'Excellent product!!', body: 'While I\'ve enjoyed similar treats that are cheaper, this one has a distinct quality that makes it worth trying. I believe Crizbe is on the right track, and I\'m excited to see what new flavors...' },
                                            { name: 'Eddie Lake', time: '1 month ago', text: 'Excellent product!!', body: 'I recently sampled the Crizbe Crunch stick in almond flavor, and I was genuinely impressed! At about 300, it delivers a unique flavor that really sets it apart from others.' },
                                            { name: 'Rhonda Rhodes', time: '1 month ago', text: 'Excellent product!!', body: '' },
                                        ].map((review, idx) => (
                                            <div key={idx} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-[#2ECC71] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-white" /> 4.5
                                                    </span>
                                                    <h4 className="font-semibold text-sm text-[#333]">{review.text}</h4>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">{review.name} <span className="mx-1">·</span> {review.time}</p>
                                                {review.body && (
                                                    <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                                                        {review.body}
                                                    </p>
                                                )}

                                                {/* Images for review #2 (Chris Glasser) per screenshot */}
                                                {idx === 1 && (
                                                    <div className="flex gap-2 mt-3">
                                                        {/* Placeholder for review images */}
                                                        {[1, 2, 3].map(imgIdx => (
                                                            <div key={imgIdx} className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden relative">
                                                                <img
                                                                    src={product.images?.[imgIdx - 1]?.image || product.images?.[0]?.image}
                                                                    className="w-full h-full object-cover"
                                                                    alt="Review image"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        <button className="text-[#007BFF] text-xs font-medium hover:underline">View More</button>
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-32 pt-12 border-t border-[#EAEAEA]">
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8 font-serif">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((p: any) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsPage;