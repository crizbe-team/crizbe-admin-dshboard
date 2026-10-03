'use client';

import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (!product) return;

        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crizbe.com').replace(/\/$/, '');
        const metaDetails = product.meta_details || {};
        const title = metaDetails.meta_title || product.meta_title || `${product.name} | Crizbe Chocolate`;
        const rawDesc = metaDetails.meta_description || product.meta_description || product.description || '';
        const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        const description = cleanDesc.slice(0, 160) || `Savor the roasted perfection of Crizbe's premium ${product.name} crunch sticks.`;

        document.title = title;

        let rawImage = product.images?.[0]?.image || product.icon || `${siteUrl}/images/user/og-image.jpeg`;
        let ogImage = rawImage;
        if (ogImage && !ogImage.startsWith('http://') && !ogImage.startsWith('https://')) {
            const apiDomain = (process.env.NEXT_PUBLIC_BASE_URL || 'https://api.crizbe.com')
                .replace(/\/api\/v1\/?$/, '')
                .replace(/\/$/, '');
            if (ogImage.startsWith('/media/')) {
                ogImage = `${apiDomain}${ogImage}`;
            } else {
                const cleanPath = ogImage.startsWith('/') ? ogImage : `/${ogImage}`;
                ogImage = `${siteUrl}${cleanPath}`;
            }
        }

        const mimeType = ogImage.endsWith('.webp')
            ? 'image/webp'
            : ogImage.endsWith('.png')
              ? 'image/png'
              : 'image/jpeg';

        const setMetaTag = (name: string, content: string, isProperty = false) => {
            if (!content) return;
            const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let el = document.querySelector(selector) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                if (isProperty) {
                    el.setAttribute('property', name);
                } else {
                    el.setAttribute('name', name);
                }
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMetaTag('description', description);
        setMetaTag('og:title', title, true);
        setMetaTag('og:description', description, true);
        setMetaTag('og:image', ogImage, true);
        setMetaTag('og:image:secure_url', ogImage, true);
        setMetaTag('og:image:type', mimeType, true);
        setMetaTag('og:image:width', '1200', true);
        setMetaTag('og:image:height', '630', true);
        setMetaTag('og:url', `${siteUrl}/products/${productId}/`, true);
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:title', title);
        setMetaTag('twitter:description', description);
        setMetaTag('twitter:image', ogImage);
    }, [product, productId]);

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
                <span className="font-[var(--font-inter-tight)] text-[16px] text-[#191919] font-medium leading-[140%] tracking-[0.01em] lining-nums proportional-nums inline-block truncate max-w-[160px] sm:max-w-none align-bottom">
                    {product.name}
                </span>
            ),
        },
    ];

    return (
        <>
            <div className="wrapper pt-[80px] pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left Column: Sticky Breadcrumb & Gallery */}
                    <div className="lg:col-span-6">
                        <div className="sticky top-[90px] space-y-6">
                            <Breadcrumb items={breadcrumbItems} />
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
                            {/* 1. About the Product - Rich HTML Content */}
                            <AccordionItem
                                title={
                                    <span className="font-[var(--font-inter-tight)] font-medium text-[18px] tracking-[0.02em] text-[#191919] lining-nums proportional-nums">
                                        About the Product
                                    </span>
                                }
                                defaultOpen={true}
                            >
                                <div
                                    className="font-[var(--font-inter-tight)] font-normal text-[15px] leading-relaxed text-[#373737] space-y-4 py-1 overflow-x-auto
                                    [&_h2]:text-lg [&_h2]:font-bricolage [&_h2]:font-bold [&_h2]:text-[#4E3325] [&_h2]:mt-5 [&_h2]:mb-2
                                    [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#4E3325] [&_h3]:mt-4 [&_h3]:mb-1.5
                                    [&_strong]:font-semibold [&_strong]:text-[#191919]
                                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3
                                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:my-3
                                    [&_li]:text-[#373737] [&_p]:mb-3
                                    [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_table]:border [&_table]:border-[#EAEAEA] [&_table]:rounded-xl [&_table]:overflow-hidden
                                    [&_thead]:bg-[#FAF4E6] [&_thead]:text-[#4E3325]
                                    [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-xs [&_th]:border-b [&_th]:border-[#EAEAEA]
                                    [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs [&_td]:text-[#525252] [&_td]:border-b [&_td]:border-[#EAEAEA]/60
                                    [&_tr:last-child_td]:border-b-0"
                                    dangerouslySetInnerHTML={{
                                        __html: product?.description || '',
                                    }}
                                />
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
                                                {product.total_reviews || 0} ratings &amp; reviews
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

                {/* FAQs Section - New Full-Width Row Below Gallery & Right Info Grid */}
                {(() => {
                    let faqsList: any[] = [];
                    if (product.faqs) {
                        try {
                            faqsList =
                                typeof product.faqs === 'string'
                                    ? JSON.parse(product.faqs)
                                    : product.faqs;
                        } catch {
                            faqsList = [];
                        }
                    } else if (product.faq_list) {
                        faqsList = product.faq_list;
                    }

                    if (!Array.isArray(faqsList) || faqsList.length === 0) return null;

                    return (
                        <div className="mt-12 pt-10 border-t border-[#EAEAEA]">
                            <h2 className="font-inter-tight font-semibold text-[24px] sm:text-[28px] text-[#191919] mb-6">
                                Frequently Asked Questions
                            </h2>
                            <div className="divide-y divide-[#EBE5D9]/60">
                                {faqsList.map((faq: any, idx: number) => (
                                    <AccordionItem
                                        key={idx}
                                        title={
                                            <span className="font-inter-tight font-medium text-[17px] text-[#191919]">
                                                {faq.question}
                                            </span>
                                        }
                                        defaultOpen={idx === 0}
                                    >
                                        <p className="font-inter-tight text-[15px] text-[#525252] leading-relaxed py-1">
                                            {faq.answer}
                                        </p>
                                    </AccordionItem>
                                ))}
                            </div>
                        </div>
                    );
                })()}

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
