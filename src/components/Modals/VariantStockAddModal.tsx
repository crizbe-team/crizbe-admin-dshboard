'use client';

import React, { useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { variantStockSchema, type VariantStockFormData } from '@/validations/stock';
import { useCreateStock } from '@/queries/use-stock';
import { useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/utils/api-endpoints';

interface Variant {
    id: string;
    size: string;
}

interface Props {
    isModalOpen: boolean;
    handleCloseModal: () => void;
    variants: Variant[];
    productName: string;
    productId: string;
}

export default function VariantStockAddModal({
    isModalOpen,
    handleCloseModal,
    variants,
    productName,
    productId,
}: Props) {
    const queryClient = useQueryClient();
    const { mutate: addStock, isPending: isLoading } = useCreateStock();

    const {
        register,
        handleSubmit: handleFormSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<VariantStockFormData>({
        resolver: zodResolver(variantStockSchema),
        defaultValues: {
            variantId: '',
            quantity: '',
            purchase_price: '',
            notes: '',
        },
    });

    useEffect(() => {
        if (isModalOpen) {
            reset({
                variantId: variants.length === 1 ? variants[0].id : '',
                quantity: '',
                purchase_price: '',
                notes: '',
            });
        }
    }, [isModalOpen, variants, reset]);

    if (!isModalOpen) return null;

    const onFormSubmit = (data: VariantStockFormData) => {
        addStock(
            {
                variant: data.variantId,
                quantity: parseFloat(data.quantity) || 0,
                purchase_price: parseFloat(data.purchase_price || '0') || 0,
                notes: data.notes,
                type: 'Addition',
            },
            {
                onSuccess: () => {
                    // Invalidate queries to refresh data
                    queryClient.invalidateQueries({
                        queryKey: [API_ENDPOINTS.GET_STOCK_HISTORY_LIST, { product: productId }],
                    });
                    queryClient.invalidateQueries({
                        queryKey: [API_ENDPOINTS.GET_PRODUCT_STOCK, productId],
                    });
                    handleCloseModal();
                    reset();
                },
                onError: (error: any) => {
                    if (error?.errors && Object.keys(error.errors).length > 0) {
                        // Map field-specific errors
                        Object.keys(error.errors).forEach((field) => {
                            setError(field as any, {
                                type: 'server',
                                message: error.errors[field][0],
                            });
                        });
                    } else {
                        // Fallback to global error
                        setError('root.serverError' as any, {
                            type: 'server',
                            message: error?.message || 'Something went wrong. Please try again.',
                        });
                    }
                },
            }
        );
    };

    const globalError = (errors.root as any)?.serverError?.message;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-lg mx-4">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between bg-[#212121]">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-100">Add Variant Stock</h2>
                        <p className="text-sm text-gray-400">{productName}</p>
                    </div>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit(onFormSubmit)} className="p-6 space-y-4">
                    {globalError && (
                        <div className="bg-red-900 bg-opacity-20 border border-red-900 text-red-500 text-sm p-3 rounded-lg">
                            {globalError}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Variant (Size)
                        </label>
                        <select
                            {...register('variantId')}
                            className={`w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border focus:outline-none transition-colors ${
                                errors.variantId
                                    ? 'border-red-500'
                                    : 'border-[#3a3a3a] focus:border-purple-500'
                            }`}
                        >
                            <option value="">-- Select Variant --</option>
                            {variants.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.size}
                                </option>
                            ))}
                        </select>
                        {errors.variantId && (
                            <p className="mt-1 text-xs text-red-500">{errors.variantId.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Quantity (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('quantity')}
                            placeholder="e.g. 10"
                            className={`w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border focus:outline-none transition-colors ${
                                errors.quantity
                                    ? 'border-red-500'
                                    : 'border-[#3a3a3a] focus:border-purple-500'
                            }`}
                        />
                        {errors.quantity && (
                            <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            {...register('notes')}
                            placeholder="Add any notes..."
                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 h-24 shadow-sm"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-[#2a2a2a]">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] rounded-lg transition-colors border border-[#3a3a3a]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 min-h-[40px] bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-lg shadow-purple-600/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Add Variant Stock'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
