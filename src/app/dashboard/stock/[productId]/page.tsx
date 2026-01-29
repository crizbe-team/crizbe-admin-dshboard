'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    History,
    Layers,
    ChevronRight,
    Trash2,
    ShoppingCart,
    Archive,
    CheckCircle,
    Package,
    Box,
} from 'lucide-react';
import Link from 'next/link';
import VariantStockAddModal from '@/components/Modals/VariantStockAddModal';
import StockAddModal from '@/components/Modals/StockAddModal';
import { useQueryClient } from '@tanstack/react-query';
import {
    useFetchProductStock,
    useFetchStockHistoryList,
    useCreateStock,
    useDeleteStockHistory,
} from '@/queries/use-stock';
import { useFetchProducts } from '@/queries/use-products';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import Loader from '@/components/ui/loader';

export default function ProductStockPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.productId as string;
    const queryClient = useQueryClient();

    // Fetch Product Stock Detail
    const { data: productStockData, isLoading: isProductLoading } = useFetchProductStock(productId);

    // Fetch Global Stock History for this product
    const { data: historyResponse, isLoading: isHistoryLoading } = useFetchStockHistoryList({
        product: productId,
    });

    // Fetch Products for the modal
    const { data: productsData } = useFetchProducts();

    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);

    const createMutation = useCreateStock();
    const deleteHistoryMutation = useDeleteStockHistory();

    const product = productStockData || {};
    const variants = productStockData?.variants || [];
    const history = historyResponse?.data || [];

    const stats = [
        {
            title: 'Total Stock',
            value: (product.total_stock || 0).toLocaleString() + ' kg',
            icon: Package,
            color: 'text-blue-400',
        },
        {
            title: 'Available',
            value: (product.available_stock || 0).toLocaleString() + ' kg',
            icon: CheckCircle,
            color: 'text-green-400',
        },
        {
            title: 'Sold',
            value: (product.sold || 0).toLocaleString() + ' kg',
            icon: ShoppingCart,
            color: 'text-purple-400',
        },
        {
            title: 'Packed',
            value: (product.packed || 0).toLocaleString() + ' kg',
            icon: Archive,
            color: 'text-orange-400',
        },
    ];

    const handleAddVariantStock = async (data: any) => {
        try {
            await createMutation.mutateAsync({
                variant: data.variantId,
                quantity: data.quantity,
                purchase_price: data.purchase_price,
                notes: data.notes,
                type: 'Addition',
            });
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({
                queryKey: [API_ENDPOINTS.GET_STOCK_HISTORY_LIST, { product: productId }],
            });
            queryClient.invalidateQueries({
                queryKey: [API_ENDPOINTS.GET_PRODUCT_STOCK, productId],
            });
            setIsVariantModalOpen(false);
        } catch (error) {
            console.error('Failed to add variant stock:', error);
        }
    };

    const handleAddStock = async (data: any) => {
        try {
            await createMutation.mutateAsync({
                product: data.productId,
                quantity: data.quantity,
                purchase_price: data.purchase_price,
                notes: data.notes,
                type: 'Addition',
            });
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({
                queryKey: [API_ENDPOINTS.GET_STOCK_HISTORY_LIST, { product: productId }],
            });
            queryClient.invalidateQueries({
                queryKey: [API_ENDPOINTS.GET_PRODUCT_STOCK, productId],
            });
            setIsStockModalOpen(false);
        } catch (error) {
            console.error('Failed to add stock:', error);
        }
    };

    const handleDeleteHistory = async (id: string | number) => {
        if (
            confirm(
                'Are you sure you want to delete this history record? This will reverse the stock change.'
            )
        ) {
            try {
                await deleteHistoryMutation.mutateAsync(id);
                // Also invalidate detail to update stats
                queryClient.invalidateQueries({
                    queryKey: [API_ENDPOINTS.GET_PRODUCT_STOCK, productId],
                });
            } catch (error) {
                console.error('Failed to delete history:', error);
            }
        }
    };

    const availableProducts =
        productsData?.data?.map((p: any) => ({
            id: p.id,
            name: p.name,
            product_id_code: p.productId,
        })) || [];

    if (isProductLoading) {
        return (
            <div className="p-12">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100">{product.name}</h1>
                        <p className="text-gray-400">
                            Manage stock and variants for {product.productId}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsStockModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-100 border border-[#3a3a3a] rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Stock</span>
                    </button>
                    <button
                        onClick={() => setIsVariantModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Variant Stock</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Variants List */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden">
                        <div className="p-4 border-b border-[#2a2a2a] flex items-center space-x-2">
                            <Layers className="w-4 h-4 text-purple-400" />
                            <h2 className="font-semibold text-gray-100">Product Variants</h2>
                        </div>
                        <div className="divide-y divide-[#2a2a2a]">
                            {variants.map((v: any) => (
                                <Link
                                    key={v.id}
                                    href={`/dashboard/stock/${productId}/${v.id}`}
                                    className="p-4 flex items-center justify-between hover:bg-[#2a2a2a] transition-colors group"
                                >
                                    <div>
                                        <p className="text-gray-100 font-medium">{v.size}</p>
                                        <p className="text-sm text-gray-400">
                                            ${parseFloat(v.price || '0').toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-semibold text-purple-400">
                                            {v.quantity} in stock
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stock History */}
                <div className="lg:col-span-2">
                    <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                        <div className="p-4 border-b border-[#2a2a2a] flex items-center space-x-2">
                            <History className="w-4 h-4 text-blue-400" />
                            <h2 className="font-semibold text-gray-100">Stock History</h2>
                        </div>
                        <div className="overflow-x-auto">
                            {isHistoryLoading ? (
                                <div className="p-12">
                                    <Loader />
                                </div>
                            ) : history.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#2a2a2a]">
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                                VARIANT
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                                QUANTITY (kg)
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                                TYPE
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                                DATE
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                                NOTES
                                            </th>
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                                ACTIONS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((item: any) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors text-sm"
                                            >
                                                <td className="p-4 text-gray-100">
                                                    {item.variant_name}
                                                </td>
                                                <td className="p-4 text-gray-300">
                                                    {(item.type === 'Addition' ? '+' : '-') +
                                                        item.quantity}
                                                </td>
                                                <td className="p-4">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full bg-opacity-10 text-xs ${
                                                            item.type === 'Addition'
                                                                ? 'bg-blue-500 text-blue-400'
                                                                : 'bg-red-500 text-red-400'
                                                        }`}
                                                    >
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-400">{item.date}</td>
                                                <td className="p-4 text-gray-400 max-w-xs truncate">
                                                    {item.notes}
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => handleDeleteHistory(item.id)}
                                                        className="p-2 bg-red-500 bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors text-red-500"
                                                        title="Delete History Record"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-gray-400">No stock history available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <VariantStockAddModal
                isModalOpen={isVariantModalOpen}
                handleCloseModal={() => setIsVariantModalOpen(false)}
                handleSubmit={handleAddVariantStock}
                variants={variants}
                productName={product.name}
            />

            <StockAddModal
                isModalOpen={isStockModalOpen}
                handleCloseModal={() => setIsStockModalOpen(false)}
                handleSubmit={handleAddStock}
                availableProducts={availableProducts}
                defaultProductId={productId}
            />
        </div>
    );
}
