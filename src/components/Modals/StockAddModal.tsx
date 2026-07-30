'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Box } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockSchema, type StockFormData } from '@/validations/stock';
import { useCreateStock } from '@/queries/use-stock';
import { useFetchProducts } from '@/queries/use-products';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { DashboardInput, DashboardTextarea } from '@/components/ui/DashboardFields';

interface Props {
    isModalOpen: boolean;
    handleCloseModal: () => void;
    defaultProductId?: string;
}

export default function StockAddModal({ isModalOpen, handleCloseModal, defaultProductId }: Props) {
    const [productSearch, setProductSearch] = useState('');
    const { data: productsData, isLoading: isProductsLoading } = useFetchProducts({
        q: productSearch,
    });
    const productsList = productsData?.data || [];

    const { mutate: createStockMutation, isPending: isCreating } = useCreateStock();

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<StockFormData>({
        resolver: zodResolver(stockSchema),
        mode: 'onChange',
        defaultValues: {
            product: '',
            quantity: '',
            type: 'Addition',
            notes: '',
        },
    });

    useEffect(() => {
        if (isModalOpen) {
            reset({
                product: defaultProductId || '',
                quantity: '',
                type: 'Addition',
                notes: '',
            });
        }
    }, [isModalOpen, defaultProductId]);

    if (!isModalOpen) return null;

    const onFormSubmit = (data: StockFormData) => {
        createStockMutation(
            {
                ...data,
                quantity: parseFloat(data.quantity) || 0,
            },
            {
                onSuccess: () => {
                    handleCloseModal();
                },
                onError: (error: any) => {
                    if (error?.errors && Object.keys(error.errors).length > 0) {
                        Object.keys(error.errors).forEach((field) => {
                            setError(field as any, {
                                type: 'server',
                                message: error.errors[field][0],
                            });
                        });
                    } else {
                        setError('root.serverError' as any, {
                            type: 'server',
                            message: error?.message || 'Something went wrong.',
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
                    <Box className="w-6 h-6 text-[#E8BF7A]" />
                    <h3 className="text-xl font-bold text-white font-bricolage">
                        Add Inventory Stock
                    </h3>
                </div>
                <p className="text-gray-400 text-xs mb-6">
                    Add new product stock batch quantity in kilograms.
                </p>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    {globalError && (
                        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold p-3 rounded-xl">
                            {globalError}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                            Target Product
                        </label>
                        <Controller
                            control={control}
                            name="product"
                            render={({ field }) => (
                                <SearchableSelect
                                    options={productsList.map((p: any) => ({
                                        label: p.name,
                                        value: p.id,
                                    }))}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onSearchChange={setProductSearch}
                                    isLoading={isProductsLoading}
                                    placeholder="Search for a Product..."
                                />
                            )}
                        />
                        {errors.product && (
                            <p className="mt-1 text-xs font-semibold text-rose-400">{errors.product.message}</p>
                        )}
                    </div>

                    <DashboardInput
                        name="quantity"
                        control={control}
                        type="number"
                        step="0.01"
                        label="Quantity (kg)"
                        placeholder="e.g. 10"
                    />

                    <DashboardTextarea
                        name="notes"
                        control={control}
                        label="Notes (Optional)"
                        placeholder="Add stock batch notes..."
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
                            disabled={isCreating}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2"
                        >
                            {isCreating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Add Stock Batch'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
