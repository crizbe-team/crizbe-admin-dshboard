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
        <div className="wrapper pt-28 pb-8">
            <div className="mb-8">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 ">
                {/* Left Column: Gallery */}
                <div className="lg:col-span-6">
                    <div className="sticky top-24">
                        <ProductGallery
                            images={product.images || []}
                            productName={product.name}
                            productIcon={product.icon}
                        />
                    </div>
                </div>

                {/* Right Column: Info */}
                <div className="lg:col-span-6">
                    <ProductInfo product={product} />

                    <div className="space-y-3">
                        {/* About the product - Styled as per screenshot "About the product" with a small line on right? Screenshot shows "-" (minus) icon typically for open accordion */}
                        <AccordionItem title="About the product" defaultOpen={true}>
                            {/* Screenshot text: "Crizbe Crunch Sticks are the perfect snack... just pure, delightful crunchiness." */}
                            <div className="text-sm text-[#5A5A5A] leading-relaxed">
                                <p>
                                    {product?.description}
                                </p>
                                <p>
                                    {product?.ingredients}
                                </p>
                            </div>
                        </AccordionItem>

                        {/* Ratings & Reviews - Match API data */}
                        <AccordionItem title="Ratings & Reviews">
                            <div className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Left: Overall Rating */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <Star className="w-10 h-10 fill-[#2ECC71] text-[#2ECC71]" />
                                            <span className="text-5xl font-bold text-[#2ECC71]">{Number(product.average_rating || 0).toFixed(1)}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{product.total_reviews || 0} ratings & reviews</p>
                                    </div>
                                    {/* Right: Progress Bars (Calculated from reviews) */}
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating) => {
                                            const count = product.reviews?.filter((r: any) => r.rating === rating).length || 0;
                                            const total = product.total_reviews || 1;
                                            const percentage = (count / total) * 100;
                                            const label = rating === 5 ? 'Excellent' : rating === 4 ? 'Very good' : rating === 3 ? 'Good' : rating === 2 ? 'Average' : 'Poor';

                                            return (
                                                <div key={rating} className="flex items-center gap-4 text-xs">
                                                    <span className="w-16 text-gray-600">{label}</span>
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#2ECC71]" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                    <span className="w-8 text-right text-gray-400">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Customer Reviews Box style */}
                                <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
                                    <h3 className="font-bold text-[#1A1A1A] mb-6">Customers Reviews</h3>

                                    {/* Review Item */}
                                    <div className="space-y-6">
                                        {product.reviews && product.reviews.length > 0 ? (
                                            product.reviews.map((review: any, idx: number) => (
                                                <div key={review.id || idx} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="bg-[#2ECC71] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-white" /> {review.rating}
                                                        </span>
                                                        <h4 className="font-semibold text-sm text-[#333]">
                                                            {review.rating >= 4 ? 'Excellent product!!' : 'Good product'}
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        {review.user_name || 'Anonymous User'}
                                                        <span className="mx-1">·</span>
                                                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                    {review.comment && (
                                                        <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                                                            {review.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 py-4 text-center">No reviews yet for this product.</p>
                                        )}
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