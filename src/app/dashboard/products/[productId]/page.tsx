'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Box,
    Layers,
    ShoppingCart,
    Info,
    List,
    IndianRupee,
    Tag,
    Clock,
} from 'lucide-react';
import { useFetchSingleProduct } from '@/queries/use-products';
import Loader from '@/components/ui/loader';
import { useState } from 'react';

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
    const [activeImage, setActiveImage] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader />
            </div>
        );
    }

    if (error || !productData) {
        return (
            <div className="p-8 text-center text-red-400 bg-red-900 bg-opacity-10 rounded-lg border border-red-900 mx-4 mt-8">
                <p>Failed to load product details. Please try again later.</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const product = productData || {};
    const images = product.images || [];
    const mainImage = activeImage || (images.length > 0 ? images[0].image : null);

    const stats = [
        {
            title: 'Available Stock',
            value: `${parseFloat(product.available_stock || '0').toLocaleString()} ${product.unit || 'kg'}`,
            icon: Box,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
        },
        {
            title: 'Total Stock',
            value: `${parseFloat(product.total_stock || '0').toLocaleString()} ${product.unit || 'kg'}`,
            icon: Package,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
        },
        {
            title: 'Variants',
            value: (product.variants?.length || 0).toString(),
            icon: Layers,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
        },
        {
            title: 'Product Status',
            value: product.is_active ? 'Active' : 'Inactive',
            icon: Info,
            color: product.is_active ? 'text-blue-400' : 'text-red-400',
            bg: product.is_active ? 'bg-blue-500/10' : 'bg-red-500/10',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
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
                            <h1 className="text-3xl font-bold text-gray-100">{product.name}</h1>
                            <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30 uppercase tracking-wider">
                                {product.category_details?.name || 'Uncategorized'}
                            </span>
                        </div>
                        <p className="text-gray-400 flex items-center space-x-2">
                            <span className="text-xs px-2 py-0.5 bg-[#2a2a2a] rounded border border-[#3a3a3a]">
                                Created: {formatDateTime(product.created_at)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden group hover:border-[#3a3a3a] transition-all"
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                            </div>
                            <div
                                className={`${stat.color} ${stat.bg} p-3.5 rounded-xl group-hover:scale-110 transition-transform`}
                            >
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div
                            className={`absolute -bottom-4 -right-4 w-24 h-24 ${stat.bg} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`}
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Media & Visuals */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-xl">
                        <div className="aspect-square bg-[#0f0f0f] flex items-center justify-center relative group">
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="text-8xl p-12 bg-purple-900/10 rounded-full">
                                    {product.icon || '📦'}
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="p-4 grid grid-cols-4 gap-3 bg-[#111]">
                                {images.map((img: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img.image)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                            activeImage === img.image || (!activeImage && idx === 0)
                                                ? 'border-purple-600 scale-95 shadow-lg shadow-purple-600/20'
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
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 space-y-4 shadow-lg">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center space-x-2">
                            <Info className="w-4 h-4" />
                            <span>Product Meta</span>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">Inventory Status</span>
                                <span
                                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                                        (product.available_stock || 0) > 10
                                            ? 'text-green-400 bg-green-400/10'
                                            : 'text-red-400 bg-red-400/10'
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
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-purple-600/10 scale-150">
                            <List className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center space-x-3">
                                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
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
                        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center space-x-3">
                                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                                <span>Key Ingredients</span>
                            </h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {product.ingredients}
                            </p>
                        </div>
                    )}

                    {/* Variants Table */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-lg">
                        <div className="p-6 border-b border-[#2a2a2a] bg-linear-to-r from-transparent to-[#2a2a2a]/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-100 flex items-center space-x-3">
                                <Layers className="w-6 h-6 text-purple-400" />
                                <span>Available Variants</span>
                            </h2>
                            <span className="text-xs text-gray-400 font-medium px-3 py-1 bg-[#2a2a2a] rounded-full border border-[#333]">
                                {product.variants?.length || 0} Optional Sizes
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            {product.variants && product.variants.length > 0 ? (
                                <table className="w-full">
                                    <thead className="bg-[#2a2a2a]/30">
                                        <tr>
                                            <th className="text-left p-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                                                Size/Variant
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                                                Inventory
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2a2a2a]">
                                        {product.variants.map((variant: any, idx: number) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-white/5 transition-colors group text-sm"
                                            >
                                                <td className="p-4 font-semibold text-gray-200">
                                                    {variant.size}
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-purple-400 font-bold">
                                                        $
                                                        {parseFloat(variant.price || '0').toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-300">
                                                    {variant.quantity || 0} units
                                                </td>
                                                <td className="p-4">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                            (variant.quantity || 0) > 0
                                                                ? 'bg-green-500/20 text-green-500'
                                                                : 'bg-red-500/20 text-red-500'
                                                        }`}
                                                    >
                                                        {(variant.quantity || 0) > 0
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
                                    <div className="mb-4 inline-flex p-4 bg-gray-500/10 rounded-full text-gray-600">
                                        <Layers className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-500 text-sm">
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
