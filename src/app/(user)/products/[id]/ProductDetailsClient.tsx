'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchSingleProduct, useFetchRelatedProducts } from '@/queries/use-products';
import UserLoaders from '@/components/ui/UserLoader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGallery from '@/app/_components/ui/ProductGallery';
import ProductInfo from '@/app/_components/ui/ProductInfo';
import AccordionItem from '@/components/ui/Accordion';
import ProductCard from '@/app/_components/ui/ProductCard';
import { ArrowLeft, Star, Plus } from 'lucide-react';
import ReviewAddModal from '@/components/Modals/ReviewAddModal';
import AuthActionWrapper from '@/components/AuthActionWrapper';
import Image from 'next/image';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const productId = Array.isArray(id) ? id[0] : id;

    const { data: productData, isLoading, isError } = useFetchSingleProduct(productId || '');
    const { data: relatedProductsData } = useFetchRelatedProducts(productId || '');
    const product = productData?.data;
    const relatedProducts = relatedProductsData?.data || [];
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    console.log(productData, 'isError', isError);

    if (isLoading) {
        return <UserLoaders />;
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
        {
            label: (
                <span className="font-[var(--font-inter-tight)] font-normal text-[16px] leading-[140%] tracking-[0.01em] lining-nums proportional-nums">
                    Home
                </span>
            ),
            href: '/',
        },
        {
            label: (
                <span className="font-[var(--font-inter-tight)] font-normal text-[16px] leading-[140%] tracking-[0.01em] lining-nums proportional-nums">
                    Products
                </span>
            ),
            href: '/products',
        },
        {
            label: (
                <span className="font-[var(--font-inter-tight)]  text-[16px] text-[#191919] font-medium leading-[140%] tracking-[0.01em] lining-nums proportional-nums">
                    {product.name}
                </span>
            ),
        },
    ];

    return (
        <>
            <div className="wrapper pt-[80px] pb-8">
                <div className="mb-[32px]">
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
                            <AccordionItem
                                title={
                                    <span className="font-[var(--font-inter-tight)] font-medium text-[18px]  tracking-[0.02em] text-[#191919] text-center lining-nums proportional-nums">
                                        About the product
                                    </span>
                                }
                                defaultOpen={true}
                            >
                                {/* Screenshot text: "Crizbe Crunch Sticks are the perfect snack... just pure, delightful crunchiness." */}
                                <div className="font-[var(--font-inter-tight)] font-normal text-[16px] leading-[140%] tracking-[0.01em] text-[#373737] [font-variant-numeric:lining-nums_proportional-nums]">
                                    <p>{product?.description}</p>
                                    <p>{product?.ingredients}</p>
                                </div>
                            </AccordionItem>

                            {/* Ratings & Reviews - Match API data */}
                            <AccordionItem
                                title={
                                    <div className="flex items-center justify-between w-full pr-2">
                                        <span className="font-[var(--font-inter-tight)] font-medium text-[18px] tracking-[0.02em] text-[#191919] lining-nums proportional-nums">
                                            Ratings &amp; Reviews
                                        </span>
                                        <AuthActionWrapper>
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setReviewModalOpen(true);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.stopPropagation();
                                                        setReviewModalOpen(true);
                                                    }
                                                }}
                                                className="flex items-center gap-1.5 border border-[#4E3325] rounded-[8px] px-4 py-1.5 text-[13px] font-medium text-[#4E3325] hover:bg-[#4E3325] hover:text-white transition-all duration-300 cursor-pointer select-none"
                                            >
                                                <Plus className="w-3.5 h-3.5 text-[#4E3325]" />
                                                Add review
                                            </div>
                                        </AuthActionWrapper>
                                    </div>
                                }
                            >
                                <div className="mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        {/* Left: Overall Rating */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <Star className="w-10 h-10 fill-[#239B44] text-[#239B44]" />
                                                <span className="text-5xl font-bold text-[#239B44]">
                                                    {Number(product.average_rating || 0).toFixed(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#747474] mt-1">
                                                {product.total_reviews || 0} ratings & reviews
                                            </p>
                                        </div>
                                        {/* Right: Progress Bars (Calculated from reviews) */}
                                        <div className="space-y-2">
                                            {[5, 4, 3, 2, 1].map((rating) => {
                                                const count =
                                                    product.reviews?.filter(
                                                        (r: any) => r.rating === rating
                                                    ).length || 0;
                                                const total = product.total_reviews || 1;
                                                const percentage = (count / total) * 100;
                                                const label =
                                                    rating === 5
                                                        ? 'Excellent'
                                                        : rating === 4
                                                            ? 'Very good'
                                                            : rating === 3
                                                                ? 'Good'
                                                                : rating === 2
                                                                    ? 'Average'
                                                                    : 'Poor';

                                                return (
                                                    <div
                                                        key={rating}
                                                        className="flex items-center gap-4 text-xs"
                                                    >
                                                        <span className="w-16 text-gray-600">
                                                            {label}
                                                        </span>
                                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#239B44]"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="w-8 text-right text-gray-400">
                                                            {count}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Customer Reviews Box style */}
                                    <div className="border border-[#EAEAEA] rounded-2xl p-[20px]">
                                        <h3 className="font-inter-tight font-medium text-[18px] leading-[35.91px] tracking-[0.02em] text-[#191919] mb-6">
                                            Customers Reviews
                                        </h3>

                                        {/* Review Item */}
                                        <div className="space-y-6">
                                            {product.reviews && product.reviews.length > 0 ? (
                                                <>
                                                    {(showAllReviews
                                                        ? product.reviews
                                                        : product.reviews.slice(0, 4)
                                                    ).map((review: any, idx: number) => (
                                                        <div
                                                            key={review.id || idx}
                                                            className="pb-6 border-b border-dashed border-gray-200 last:border-0 last:pb-0"
                                                        >
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="bg-[#239B44] text-white text-[12px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                                                    <Star className="w-3 h-3 fill-white" />{' '}
                                                                    {review.rating}
                                                                </span>
                                                                <h4 className="font-inter-tight font-medium text-[20px] leading-[32px] tracking-[0.02em] text-[#191919]">
                                                                    {review.rating >= 5
                                                                        ? 'Excellent product!!'
                                                                        : review.rating >= 4
                                                                            ? 'Worth It'
                                                                            : review.rating >= 3
                                                                                ? 'Good product'
                                                                                : review.rating >= 2
                                                                                    ? 'Average product'
                                                                                    : 'Poor product'}
                                                                </h4>
                                                            </div>
                                                            <p className="font-inter-tight font-normal text-[16px] leading-[24px] tracking-[0.02em] text-[#747474] mb-2">
                                                                {review.user_name ||
                                                                    'Anonymous User'}
                                                                <span className="mx-2 text-gray-300">
                                                                    |
                                                                </span>
                                                                {new Date(
                                                                    review.created_at
                                                                ).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })}
                                                            </p>
                                                            {review.comment && (
                                                                <p className="font-inter-tight font-normal text-[16px] leading-[22px] text-[#525252] max-w-2xl mb-4">
                                                                    {review.comment}
                                                                </p>
                                                            )}
                                                            {review.images &&
                                                                review.images.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                                        {review.images.map(
                                                                            (imgObj: any) => (
                                                                                <div
                                                                                    key={imgObj.id}
                                                                                    className="relative w-[150px] h-[150px] rounded-xl overflow-hidden border border-[#EAEAEA]"
                                                                                >
                                                                                    <Image
                                                                                        src={
                                                                                            imgObj.image
                                                                                        }
                                                                                        alt="Review photo"
                                                                                        fill
                                                                                        className="object-cover"
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    ))}
                                                    {product.reviews.length > 4 &&
                                                        !showAllReviews && (
                                                            <div className="pt-2">
                                                                <button
                                                                    onClick={() =>
                                                                        setShowAllReviews(true)
                                                                    }
                                                                    className="text-[#008ECC] font-inter-tight font-medium text-[16px] underline decoration-[#008ECC] underline-offset-4 hover:opacity-80 transition-opacity"
                                                                >
                                                                    View More
                                                                </button>
                                                            </div>
                                                        )}
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-400 py-4 text-center">
                                                    No reviews yet for this product.
                                                </p>
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
                    <div className="mt-[40px] pt-12 border-t border-[#EAEAEA]">
                        <h2 className="font-inter font-semibold text-[25px] leading-[150%] tracking-[0%] text-[#191919] text-left mb-8">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p: any) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ReviewAddModal
                open={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                productSlug={product?.slug || productId || ''}
                productName={product?.name}
            />
        </>
    );
};

export default ProductDetailsPage;
