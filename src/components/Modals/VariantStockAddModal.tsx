'use client';

import React, { useEffect } from 'react';
import { X, Loader2, Layers } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { variantStockSchema, type VariantStockFormData } from '@/validations/stock';
import { useCreateStock } from '@/queries/use-stock';
import { useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import {
    DashboardInput,
    DashboardTextarea,
    DashboardSelect,
} from '@/components/ui/DashboardFields';

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
        control,
        handleSubmit: handleFormSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<VariantStockFormData>({
        resolver: zodResolver(variantStockSchema),
        mode: 'onChange',
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
    }, [isModalOpen, variants]);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
                <button
                    onClick={handleCloseModal}
                    className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <Layers className="w-6 h-6 text-[#E8BF7A]" />
                    <h3 className="text-xl font-bold text-white font-bricolage">
                        Add Variant Stock
                    </h3>
                </div>
                <p className="text-gray-400 text-xs mb-6">
                    Replenish units for <span className="font-semibold text-gray-200">{productName}</span> size variant.
                </p>

                <form onSubmit={handleFormSubmit(onFormSubmit)} className="space-y-4">
                    {globalError && (
                        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold p-3 rounded-xl">
                            {globalError}
                        </div>
                    )}

                    <DashboardSelect
                        name="variantId"
                        control={control}
                        label="Select Variant (Size)"
                    >
                        <option value="">-- Select Variant --</option>
                        {variants.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.size}
                            </option>
                        ))}
                    </DashboardSelect>

                    <DashboardInput
                        name="quantity"
                        control={control}
                        type="number"
                        step="1"
                        label="Quantity (Units)"
                        placeholder="e.g. 50"
                    />

                    <DashboardTextarea
                        name="notes"
                        control={control}
                        label="Stock Notes (Optional)"
                        placeholder="Add restock batch notes..."
                    />

                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
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
