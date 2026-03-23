'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { useFetchSingleProduct, useFetchProductReviews } from '@/queries/use-products';
import DashboardLoader from '@/components/ui/DashboardLoader';
import Pagination from '@/components/ui/Pagination';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import { useState, useEffect } from 'react';

const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    } catch (e) {
        return dateString;
    }
};

export default function AllReviewsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.productId as string;

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: productData, isLoading: isProductLoading } = useFetchSingleProduct(productId);
    const product = productData?.data || {};

    const { data: reviewsData, isLoading: isReviewsLoading } = useFetchProductReviews(
        product?.slug || '',
        {
            page: currentPage,
            q: searchQuery,
        }
    );

    const reviews = reviewsData?.data || [];
    const pagination = reviewsData?.pagination || {};
    const baseData = reviewsData?.base_data || {};
    const ratingBreakdown = baseData.rating_breakdown || {};

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    if (isProductLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <DashboardLoader text="Loading Reviews" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h1 className="text-3xl font-bold text-gray-100 italic">
                                Reviews: {product.name}
                            </h1>
                            <span className="px-3 py-1 bg-yellow-600/20 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/30 uppercase tracking-wider">
                                {baseData?.total_reviews || 0} Total
                            </span>
                        </div>
                        <p className="text-gray-400">All customer feedback for this product</p>
                    </div>
                </div>
            </div>

            {/* Summary Section */}
            {!isReviewsLoading && reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8 flex flex-col items-center justify-center text-center">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">
                            Average Rating
                        </p>
                        <div className="text-5xl font-black text-white mb-4">
                            {baseData.average_rating || 0}
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                        i < Math.floor(baseData.average_rating || 0)
                                            ? 'fill-yellow-500 text-yellow-500'
                                            : 'text-gray-700'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm">
                            Based on {baseData.total_reviews} reviews
                        </p>
                    </div>

                    <div className="md:col-span-2 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-6 border-b border-[#2a2a2a] pb-4">
                            Rating Breakdown
                        </p>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = ratingBreakdown[star] || 0;
                                const percentage = baseData.total_reviews
                                    ? (count / baseData.total_reviews) * 100
                                    : 0;
                                return (
                                    <div key={star} className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1 w-12 shrink-0">
                                            <span className="text-gray-300 font-bold text-sm">
                                                {star}
                                            </span>
                                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        </div>
                                        <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="w-10 text-right text-gray-500 text-sm font-mono">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* List/Table */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between gap-4">
                    <DebouncedSearch
                        onSearch={setSearchQuery}
                        placeholder="Search comments or users..."
                        className="max-w-md"
                    />
                </div>

                <div className="overflow-x-auto text-sm">
                    {isReviewsLoading ? (
                        <div className="p-20 text-center">
                            <div className="flex items-center justify-center space-x-3 text-gray-400 mb-4 font-bold">
                                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>Fetching complete review history...</span>
                            </div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <table className="w-full border-collapse">
                            <thead className="bg-[#2a2a2a]/30">
                                <tr>
                                    <th className="text-left p-6 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                                        USER
                                    </th>
                                    <th className="text-left p-6 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                                        RATING
                                    </th>
                                    <th className="text-left p-6 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                                        COMMENT
                                    </th>
                                    <th className="text-left p-6 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                                        DATE
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2a2a2a]">
                                {reviews.map((review: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-white/2 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold border border-purple-600/20 uppercase text-xs">
                                                    {review.user_name?.[0] || 'U'}
                                                </div>
                                                <span className="text-gray-200 font-bold">
                                                    {review.user_name || 'Verified Customer'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < (review.rating || 0)
                                                                ? 'fill-yellow-500 text-yellow-500'
                                                                : 'text-gray-700'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6 max-w-md">
                                            <div className="space-y-3">
                                                <p className="text-gray-300 leading-relaxed italic">
                                                    "{review.comment}"
                                                </p>
                                                {review.images && review.images.length > 0 && (
                                                    <div className="flex gap-2">
                                                        {review.images.map(
                                                            (img: any, iIdx: number) => (
                                                                <div
                                                                    key={iIdx}
                                                                    className="w-10 h-10 rounded bg-[#222] border border-[#333] overflow-hidden"
                                                                >
                                                                    <img
                                                                        src={img.image}
                                                                        alt=""
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 text-gray-400 whitespace-nowrap">
                                            {formatDateTime(review.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center">
                            <div className="mb-4 inline-flex p-6 bg-gray-500/10 rounded-full text-gray-600">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <p className="text-gray-400">No reviews found.</p>
                        </div>
                    )}
                </div>

                {pagination.total_pages > 1 && (
                    <div className="p-6 border-t border-[#2a2a2a]">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={pagination.has_next}
                            hasPrevious={pagination.has_previous}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
