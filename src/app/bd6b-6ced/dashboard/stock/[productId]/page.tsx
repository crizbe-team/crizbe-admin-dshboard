'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    History,
    Layers,
    ChevronRight,
    Archive,
    CheckCircle,
    Package,
} from 'lucide-react';
import Link from 'next/link';
import VariantStockAddModal from '@/components/Modals/VariantStockAddModal';
import StockAddModal from '@/components/Modals/StockAddModal';
import { useQueryClient } from '@tanstack/react-query';
import {
    useFetchProductStock,
    useFetchStockHistoryList,
    useCreateStock,
} from '@/queries/use-stock';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import UserLoaders from '@/components/ui/UserLoader';
import { formatDateTime } from '@/utils/date-utils';
import Pagination from '@/components/ui/Pagination';

export default function ProductStockPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.productId as string;
    const queryClient = useQueryClient();

    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
    const [historyType, setHistoryType] = useState<string>('All');

    // Fetch Product Stock Detail
    const { data: productStockData, isLoading: isProductLoading } = useFetchProductStock(productId);

    // Fetch Global Stock History for this product
    const { data: historyResponse, isLoading: isHistoryLoading } = useFetchStockHistoryList({
        product: productId,
        page: currentHistoryPage,
        type: historyType === 'All' ? undefined : historyType,
    });

    const createMutation = useCreateStock();

    const product = productStockData?.data || {};
    const variants = productStockData?.data?.variants || [];
    const history = historyResponse?.data || [];

    const stats = [
        {
            title: 'Total Stock',
            value: (historyResponse?.base_data?.total_stock || 0).toLocaleString() + ' kg',
            icon: Package,
            color: 'text-blue-400',
        },
        {
            title: 'Available',
            value: (historyResponse?.base_data?.available_stock || 0).toLocaleString() + ' kg',
            icon: CheckCircle,
            color: 'text-green-400',
        },
        {
            title: 'Packed',
            value: (historyResponse?.base_data?.total_deducted || 0).toLocaleString() + ' kg',
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

    if (isProductLoading) {
        return (
            <div className="p-12">
                <UserLoaders />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    href={`/bd6b-6ced/dashboard/stock/${productId}/${v.id}`}
                                    className="p-4 flex items-center justify-between hover:bg-[#2a2a2a] transition-colors group"
                                >
                                    <div>
                                        <p className="text-gray-100 font-medium">{v.size}</p>
                                        <p className="text-sm text-gray-400">
                                            ₹{parseFloat(v.price || '0').toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {v.stock > 0 ? (
                                            <span className="text-sm font-semibold text-purple-400">
                                                {v.stock} in stock
                                            </span>
                                        ) : (
                                            <span className="text-sm font-semibold text-red-400">
                                                Out of stock
                                            </span>
                                        )}
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
                        <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <History className="w-4 h-4 text-blue-400" />
                                <h2 className="font-semibold text-gray-100">Stock History</h2>
                            </div>
                            <select
                                value={historyType}
                                onChange={(e) => {
                                    setHistoryType(e.target.value);
                                    setCurrentHistoryPage(1);
                                }}
                                className="bg-[#2a2a2a] text-gray-300 text-sm px-3 py-1.5 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 cursor-pointer"
                            >
                                <option value="All">All Types</option>
                                <option value="Addition">Addition</option>
                                <option value="Subtraction">Subtraction</option>
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            {isHistoryLoading ? (
                                <div className="p-12">
                                    <UserLoaders />
                                </div>
                            ) : history.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#2a2a2a]">
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((item: any) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors text-sm"
                                            >
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
                                                <td className="p-4 text-gray-400">
                                                    {formatDateTime(item.created_at)}
                                                </td>
                                                <td className="p-4 text-gray-400 max-w-xs truncate">
                                                    {item.notes}
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

                        {historyResponse?.pagination &&
                            historyResponse.pagination.total_pages > 1 && (
                                <div className="p-4 border-t border-[#2a2a2a]">
                                    <Pagination
                                        currentPage={currentHistoryPage}
                                        totalPages={historyResponse.pagination.total_pages}
                                        onPageChange={setCurrentHistoryPage}
                                        hasNext={historyResponse.pagination.has_next}
                                        hasPrevious={historyResponse.pagination.has_previous}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <VariantStockAddModal
                isModalOpen={isVariantModalOpen}
                handleCloseModal={() => setIsVariantModalOpen(false)}
                handleSubmit={handleAddVariantStock}
                variants={variants}
                productName={product.name}
                isLoading={createMutation.isPending}
            />

            <StockAddModal
                isModalOpen={isStockModalOpen}
                handleCloseModal={() => setIsStockModalOpen(false)}
                defaultProductId={productId}
            />
        </div>
    );
}
