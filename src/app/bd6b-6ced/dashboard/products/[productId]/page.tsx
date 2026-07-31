'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Box, Layers, Info, List, Star, MessageSquare } from 'lucide-react';
import { useFetchSingleProduct } from '@/queries/use-products';
import DashboardLoader from '@/components/ui/DashboardLoader';
import { useState } from 'react';
import Link from 'next/link';

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

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.productId as string;

    const { data: productData, isLoading, error } = useFetchSingleProduct(productId);
    const product = productData?.data || {};

    const [activeImage, setActiveImage] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <DashboardLoader text="Loading Product Details" />
            </div>
        );
    }

    if (error || !productData) {
        return (
            <div className="p-8 text-center text-rose-400 bg-[#141414] rounded-3xl border border-rose-500/30 mx-4 mt-8">
                <p className="font-semibold">Failed to load product details. Please try again later.</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-medium text-sm"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const images = product.images || [];
    const mainImage = activeImage || (images.length > 0 ? images[0].image : null);

    const stats = [
        {
            title: 'Available Stock',
            value: `${parseFloat(product.available_stock || '0').toLocaleString()} ${product.unit || 'kg'}`,
            icon: Box,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
        {
            title: 'Total Stock',
            value: `${parseFloat(product.total_stock || '0').toLocaleString()} ${product.unit || 'kg'}`,
            icon: Package,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
        },
        {
            title: 'Variants',
            value: (product.variants?.length || 0).toString(),
            icon: Layers,
            color: 'text-[#E8BF7A]',
            bg: 'bg-[#E8BF7A]/10',
        },
        {
            title: 'Product Status',
            value: product.is_active ? 'Active' : 'Inactive',
            icon: Info,
            color: product.is_active ? 'text-emerald-400' : 'text-rose-400',
            bg: product.is_active ? 'bg-emerald-500/10' : 'bg-rose-500/10',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-[#141414] border border-white/10 rounded-2xl text-gray-300 hover:text-white hover:border-[#E8BF7A]/40 hover:bg-white/5 transition-all shadow-md"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#E8BF7A]" />
                    </button>
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-bricolage tracking-tight">
                                {product.name}
                            </h1>
                            <span className="px-3 py-1 bg-[#E8BF7A]/10 text-[#E8BF7A] text-xs font-bold rounded-full border border-[#E8BF7A]/20 uppercase tracking-wider">
                                {product.category_details?.name || 'Uncategorized'}
                            </span>
                        </div>
                        <p className="text-gray-400 flex items-center space-x-2">
                            <span className="text-xs px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 font-mono text-gray-300">
                                Created: {formatDateTime(product.created_at)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-[#141414] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#E8BF7A]/30 transition-all"
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-extrabold text-white font-bricolage tracking-tight">{stat.value}</p>
                            </div>
                            <div
                                className={`${stat.color} ${stat.bg} p-3.5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform`}
                            >
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customer Reviews Section */}
            {product?.reviews?.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white font-bricolage flex items-center space-x-3">
                            <MessageSquare className="w-6 h-6 text-[#E8BF7A]" />
                            <span>Customer Reviews</span>
                            <span className="text-sm font-normal text-gray-400 ml-2">
                                ({product?.reviews.length})
                            </span>
                        </h2>
                        <Link
                            href={`/bd6b-6ced/dashboard/products/${productId}/reviews`}
                            className="text-sm font-semibold text-[#E8BF7A] hover:underline transition-colors"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {product?.reviews.slice(0, 3).map((review: any, idx: number) => (
                            <div
                                key={idx}
                                className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col justify-between hover:border-[#E8BF7A]/30 transition-all"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < (review.rating || 0)
                                                            ? 'fill-[#E8BF7A] text-[#E8BF7A]'
                                                            : 'text-gray-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 bg-white/5 rounded border border-white/10 font-mono">
                                            {formatDateTime(review.created_at)}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-white mb-2 truncate font-bricolage">
                                        {review.user_name || 'Verified Customer'}
                                    </h4>
                                    <p className="text-gray-300 text-sm italic leading-relaxed line-clamp-4">
                                        "{review.comment}"
                                    </p>
                                </div>

                                {review.images && review.images.length > 0 && (
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {review.images.map((img: any, imgIdx: number) => (
                                            <div
                                                key={imgIdx}
                                                className="relative w-12 h-12 rounded-xl border border-white/10 overflow-hidden shrink-0"
                                            >
                                                <img
                                                    src={img.image}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Media & Visuals */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-4">
                        <div className="aspect-square bg-[#0a0a0a] rounded-2xl flex items-center justify-center relative group border border-white/5 overflow-hidden">
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="text-8xl p-12 bg-[#E8BF7A]/10 rounded-full text-[#E8BF7A]">
                                    {product.icon || '📦'}
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="p-3 grid grid-cols-4 gap-3 mt-3 bg-white/5 rounded-2xl border border-white/5">
                                {images.map((img: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img.image)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                            activeImage === img.image || (!activeImage && idx === 0)
                                                ? 'border-[#E8BF7A] scale-95 shadow-lg shadow-[#E8BF7A]/20'
                                                : 'border-transparent opacity-50 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={img.image}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Meta Information Cards */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 space-y-4 shadow-xl">
                        <h3 className="text-xs font-bold text-[#E8BF7A] uppercase tracking-widest flex items-center space-x-2">
                            <Info className="w-4 h-4" />
                            <span>Product Meta</span>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-gray-400 text-sm font-medium">Inventory Status</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        (product.available_stock || 0) > 10
                                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                            : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                                    }`}
                                >
                                    {(product.available_stock || 0) > 10 ? 'Healthy' : 'Low Stock'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info & Variants */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description Section */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-white/5 scale-150 pointer-events-none">
                            <List className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-white font-bricolage mb-6 flex items-center space-x-3">
                                <span className="w-1.5 h-6 bg-[#E8BF7A] rounded-full"></span>
                                <span>Overview & Description</span>
                            </h2>
                            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                                {product.description ? (
                                    <p className="whitespace-pre-wrap">{product.description}</p>
                                ) : (
                                    <p className="italic text-gray-500">
                                        No description provided for this product.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    {product.ingredients && (
                        <div className="bg-[#141414] rounded-3xl border border-white/10 p-8 shadow-xl">
                            <h2 className="text-xl font-bold text-white font-bricolage mb-6 flex items-center space-x-3">
                                <span className="w-1.5 h-6 bg-[#C4994A] rounded-full"></span>
                                <span>Key Ingredients</span>
                            </h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {product.ingredients}
                            </p>
                        </div>
                    )}

                    {/* Variants Table */}
                    <div className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white font-bricolage flex items-center space-x-3">
                                <Layers className="w-6 h-6 text-[#E8BF7A]" />
                                <span>Available Variants</span>
                            </h2>
                            <span className="text-xs text-gray-300 font-medium px-3 py-1 bg-white/5 rounded-full border border-white/10 font-mono">
                                {product.variants?.length || 0} Optional Sizes
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            {product.variants && product.variants.length > 0 ? (
                                <table className="w-full">
                                    <thead className="bg-white/5 border-b border-white/5">
                                        <tr>
                                            <th className="text-left p-4 text-gray-400 font-bold text-xs uppercase tracking-wider">
                                                Size/Variant
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-bold text-xs uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-bold text-xs uppercase tracking-wider">
                                                Inventory
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-bold text-xs uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {product.variants.map((variant: any, idx: number) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-white/5 transition-colors group text-sm"
                                            >
                                                <td className="p-4 font-semibold text-white">
                                                    {variant.size}
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-[#E8BF7A] font-bold font-mono">
                                                        ₹
                                                        {parseFloat(variant.price || '0').toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-300 font-mono">
                                                    {variant.stock || 0} units
                                                </td>
                                                <td className="p-4">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                            (variant.stock || 0) > 0
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        }`}
                                                    >
                                                        {(variant.stock || 0) > 0
                                                            ? 'Available'
                                                            : 'Sold Out'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="mb-4 inline-flex p-4 bg-white/5 rounded-full text-gray-500 border border-white/10">
                                        <Layers className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium">
                                        No specific variants listed for this product.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
