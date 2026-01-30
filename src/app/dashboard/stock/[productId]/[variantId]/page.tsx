'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    History,
    Boxes,
    Trash2,
    CheckCircle,
    ShoppingCart,
    IndianRupee,
} from 'lucide-react';
import VariantStockAddModal from '@/components/Modals/VariantStockAddModal';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchVariantStock, useCreateStock, useDeleteStockHistory } from '@/queries/use-stock';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import Loader from '@/components/ui/loader';
import { formatDateTime } from '@/utils/date-utils';

export default function VariantStockDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.productId as string;
    const variantId = params.variantId as string;
    const queryClient = useQueryClient();

    // Fetch Variant Stock Detail and History
    const { data: variantStockData, isLoading } = useFetchVariantStock(variantId);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const createMutation = useCreateStock();
    const deleteHistoryMutation = useDeleteStockHistory();

    const variant = variantStockData?.variant || {};
    const history = variantStockData?.history || [];
    const productName = variantStockData?.product_name || '';
    const baseData = variantStockData?.base_data || {};

    const handleAddStock = async (data: any) => {
        try {
            await createMutation.mutateAsync({
                variant: variantId,
                quantity: data.quantity,
                purchase_price: data.purchase_price,
                notes: data.notes,
                type: 'Addition',
            });
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({
                queryKey: [API_ENDPOINTS.GET_VARIANT_STOCK, variantId],
            });
            setIsAddModalOpen(false);
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
            } catch (error) {
                console.error('Failed to delete history:', error);
            }
        }
    };

    if (isLoading) {
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
                        <h1 className="text-2xl font-bold text-gray-100">
                            {productName} - {variant.size}
                        </h1>
                        <p className="text-gray-400">Detailed stock history for this variant</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Variant Stock</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Stock (kg)</p>
                            <p className="text-3xl font-bold text-gray-100">
                                {baseData.total_stock || 0}
                            </p>
                        </div>
                        <div className="text-blue-400 bg-blue-500 bg-opacity-10 p-3 rounded-lg">
                            <Boxes className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Available Stock (kg)</p>
                            <p className="text-3xl font-bold text-gray-100">
                                {baseData.available_stock || 0}
                            </p>
                        </div>
                        <div className="text-green-400 bg-green-500 bg-opacity-10 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Sold (kg)</p>
                            <p className="text-3xl font-bold text-gray-100">
                                {baseData.total_sold || 0}
                            </p>
                        </div>
                        <div className="text-purple-400 bg-purple-500 bg-opacity-10 p-3 rounded-lg">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Price</p>
                            <p className="text-3xl font-bold text-gray-100">
                                ${parseFloat(variant.price || '0').toFixed(2)}
                            </p>
                        </div>
                        <div className="text-yellow-400 bg-yellow-500 bg-opacity-10 p-3 rounded-lg">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="p-4 border-b border-[#2a2a2a] flex items-center space-x-2">
                    <History className="w-4 h-4 text-blue-400" />
                    <h2 className="font-semibold text-gray-100">Variation Stock History</h2>
                </div>
                <div className="overflow-x-auto">
                    {history.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a2a]">
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        QUANTITY
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
                                        className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                    >
                                        <td className="p-4 text-gray-100 font-medium">
                                            {(item.type === 'Addition' ? '+' : '-') + item.quantity}
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
                                        <td className="p-4 text-gray-400 text-sm">
                                            {formatDateTime(item.created_at)}
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">{item.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-400">
                                No stock history available for this variant.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <VariantStockAddModal
                isModalOpen={isAddModalOpen}
                handleCloseModal={() => setIsAddModalOpen(false)}
                handleSubmit={handleAddStock}
                variants={[{ id: variantId, size: variant.size }]}
                productName={productName}
            />
        </div>
    );
}
