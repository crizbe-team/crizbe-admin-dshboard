import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { variantSchema, type VariantFieldValues } from '@/validations/variant';
import { useFetchProducts } from '@/queries/use-products';
import { useCreateVariant, useUpdateVariant } from '@/queries/use-variants';

export interface VariantItem {
    id?: string;
    size: string;
    price: string;
    weight_per_unit: string;
}

export interface VariantFormData {
    productId: string;
    productName: string;
    variants: VariantItem[];
}

interface Product {
    id: string;
    name: string;
    product_id_code: string;
}

interface Props {
    isModalOpen: boolean;
    handleCloseModal: () => void;
    currentVariantData: VariantFormData | null;
    isEditMode?: boolean;
}

const commonSizes = ['100gm', '200gm', '250gm', '400gm', '500gm', '1kg'];

function VariantAddEditModal({
    isModalOpen,
    handleCloseModal,
    currentVariantData,
    isEditMode = false,
}: Props) {
    const [productSearch, setProductSearch] = useState('');
    const { data: productsData, isLoading: isProductsLoading } = useFetchProducts({
        q: productSearch,
    });
    const productsList = productsData?.data || [];

    const { mutate: createVariant, isPending: isCreating } = useCreateVariant();
    const { mutate: updateVariant, isPending: isUpdating } = useUpdateVariant();
    const isSubmitting = isCreating || isUpdating;

    const [customSizeStates, setCustomSizeStates] = useState<Record<number, boolean>>({});

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm<VariantFieldValues>({
        resolver: zodResolver(variantSchema),
        defaultValues: {
            productId: '',
            variants: [{ size: '', price: '', weight_per_unit: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'variants',
    });

    // Sync form with props when modal opens or dataset changes
    useEffect(() => {
        if (isModalOpen) {
            if (currentVariantData) {
                reset({
                    productId: currentVariantData.productId,
                    variants: currentVariantData.variants.map((v) => ({
                        id: v.id,
                        size: v.size,
                        price: (v.price || '').toString().replace('$', ''),
                        weight_per_unit: (v.weight_per_unit || '').toString(),
                    })),
                });

                // Initialize custom size states
                const initialCustomStates: Record<number, boolean> = {};
                currentVariantData.variants.forEach((v, index) => {
                    if (v.size && !commonSizes.includes(v.size)) {
                        initialCustomStates[index] = true;
                    }
                });
                setCustomSizeStates(initialCustomStates);
            } else {
                reset({
                    productId: '',
                    variants: [{ size: '', price: '', weight_per_unit: '' }],
                });
                setCustomSizeStates({});
            }
        }
    }, [isModalOpen, currentVariantData, reset]);

    const calculateWeight = (size: string): string | null => {
        const lowerSize = size.toLowerCase().trim();
        if (lowerSize.endsWith('gm') || lowerSize.endsWith('ml')) {
            const num = parseFloat(lowerSize.replace(/gm|ml/g, ''));
            if (!isNaN(num)) return (num / 1000).toString();
        }
        if (lowerSize.endsWith('kg') || lowerSize.endsWith('l')) {
            const num = parseFloat(lowerSize.replace(/kg|l/g, ''));
            if (!isNaN(num)) return num.toString();
        }
        return null;
    };

    const handleSizeChange = (index: number, value: string) => {
        if (value === 'custom') {
            setCustomSizeStates((prev) => ({ ...prev, [index]: true }));
            setValue(`variants.${index}.size`, '');
        } else {
            setCustomSizeStates((prev) => ({ ...prev, [index]: false }));
            setValue(`variants.${index}.size`, value);

            const weight = calculateWeight(value);
            if (weight) {
                setValue(`variants.${index}.weight_per_unit`, weight);
            }
        }
    };

    const handleCustomSizeChange = (index: number, value: string) => {
        setValue(`variants.${index}.size`, value);
        const weight = calculateWeight(value);
        if (weight) {
            setValue(`variants.${index}.weight_per_unit`, weight);
        }
    };

    const onSubmit = (data: VariantFieldValues) => {
        const mutationOptions = {
            onSuccess: () => {
                handleCloseModal();
                reset();
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
        };

        if (isEditMode && currentVariantData?.variants[0]?.id) {
            const variantData = data.variants[0];
            const formattedData = {
                product: data.productId,
                size: variantData.size,
                price: parseFloat(variantData.price) || 0,
                weight_per_unit: parseFloat(variantData.weight_per_unit) || 0,
            };
            updateVariant(
                { id: currentVariantData.variants[0].id, data: formattedData },
                mutationOptions
            );
        } else {
            const formattedData = data.variants.map((v) => ({
                product: data.productId,
                size: v.size,
                price: parseFloat(v.price) || 0,
                weight_per_unit: parseFloat(v.weight_per_unit) || 0,
            }));
            createVariant(formattedData, mutationOptions);
        }
    };

    if (!isModalOpen) return null;

    const globalError = (errors.root as any)?.serverError?.message;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between shrink-0 bg-[#212121]">
                    <h2 className="text-xl font-semibold text-gray-100">
                        {isEditMode ? 'Edit Variant' : 'Add New Variants'}
                    </h2>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {globalError && (
                            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-500 text-sm">
                                {globalError}
                            </div>
                        )}

                        {/* Product Selection */}
                        <div className="max-w-md">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Select Product
                            </label>
                            <Controller
                                control={control}
                                name="productId"
                                render={({ field }) => (
                                    <SearchableSelect
                                        options={productsList.map((p: any) => ({
                                            label: `${p.name}`,
                                            value: p.id,
                                        }))}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onSearchChange={setProductSearch}
                                        isLoading={isProductsLoading}
                                        placeholder="Search for a product..."
                                        isDisabled={isEditMode}
                                    />
                                )}
                            />
                            {errors.productId && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.productId.message}
                                </p>
                            )}
                        </div>

                        {/* Variants List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                    Variant Configurations
                                </h3>
                                {!isEditMode && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            append({ size: '', price: '', weight_per_unit: '' })
                                        }
                                        className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        ADD VARIANT
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="p-5 bg-[#212121] rounded-2xl border border-[#2a2a2a] relative group transition-all hover:border-[#3a3a3a] hover:bg-[#252525]"
                                    >
                                        {!isEditMode && fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 scale-90 group-hover:scale-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Size */}
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                                                    Size
                                                </label>
                                                {customSizeStates[index] ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                {...register(
                                                                    `variants.${index}.size`
                                                                )}
                                                                onChange={(e) =>
                                                                    handleCustomSizeChange(
                                                                        index,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="e.g. 750gm"
                                                                className={`w-full bg-[#1a1a1a] text-gray-100 px-4 py-2 h-[42px] text-sm rounded-lg border focus:outline-none transition-colors ${
                                                                    errors.variants?.[index]?.size
                                                                        ? 'border-red-500'
                                                                        : 'border-[#3a3a3a] focus:border-purple-500'
                                                                }`}
                                                                autoFocus
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setCustomSizeStates((prev) => {
                                                                        const next = { ...prev };
                                                                        delete next[index];
                                                                        return next;
                                                                    });
                                                                    setValue(
                                                                        `variants.${index}.size`,
                                                                        ''
                                                                    );
                                                                }}
                                                                className="text-[10px] font-bold text-gray-500 uppercase hover:text-white bg-[#333] px-2 py-1 rounded"
                                                            >
                                                                Standard
                                                            </button>
                                                        </div>
                                                        {errors.variants?.[index]?.size && (
                                                            <p className="mt-1 text-[10px] text-red-500 font-medium">
                                                                {
                                                                    errors.variants[index]?.size
                                                                        ?.message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <select
                                                            className={`w-full bg-[#1a1a1a] text-gray-100 px-4 py-2 h-[42px] text-sm rounded-lg border focus:outline-none transition-colors ${
                                                                errors.variants?.[index]?.size
                                                                    ? 'border-red-500'
                                                                    : 'border-[#3a3a3a] focus:border-purple-500'
                                                            }`}
                                                            value={
                                                                watch(`variants.${index}.size`) ||
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                handleSizeChange(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                        >
                                                            <option value="">Select Size</option>
                                                            {commonSizes.map((s) => (
                                                                <option key={s} value={s}>
                                                                    {s}
                                                                </option>
                                                            ))}
                                                            <option value="custom">
                                                                Custom Size...
                                                            </option>
                                                        </select>
                                                        {errors.variants?.[index]?.size && (
                                                            <p className="mt-1 text-[10px] text-red-500 font-medium">
                                                                {
                                                                    errors.variants[index]?.size
                                                                        ?.message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                                                    Price (₹)
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register(`variants.${index}.price`)}
                                                    className={`w-full bg-[#1a1a1a] text-gray-100 px-4 py-2 h-[42px] text-sm rounded-lg border focus:outline-none transition-colors ${
                                                        errors.variants?.[index]?.price
                                                            ? 'border-red-500'
                                                            : 'border-[#3a3a3a] focus:border-purple-500'
                                                    }`}
                                                    placeholder="0.00"
                                                />
                                                {errors.variants?.[index]?.price && (
                                                    <p className="mt-1 text-[10px] text-red-500 font-medium">
                                                        {errors.variants[index]?.price?.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Weight */}
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                                                    Weight (kg)
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register(
                                                        `variants.${index}.weight_per_unit`
                                                    )}
                                                    className={`w-full bg-[#1a1a1a] text-gray-100 px-4 py-2 h-[42px] text-sm rounded-lg border focus:outline-none transition-colors ${
                                                        errors.variants?.[index]?.weight_per_unit
                                                            ? 'border-red-500'
                                                            : 'border-[#3a3a3a] focus:border-purple-500'
                                                    }`}
                                                    placeholder="0.100"
                                                />
                                                {errors.variants?.[index]?.weight_per_unit && (
                                                    <p className="mt-1 text-[10px] text-red-500 font-medium">
                                                        {
                                                            errors.variants[index]?.weight_per_unit
                                                                ?.message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-6 border-t border-[#2a2a2a] bg-[#1a1a1a]">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-5 py-2.5 bg-[#2a2a2a] text-gray-300 hover:bg-[#333] rounded-xl transition-all font-medium border border-[#3a3a3a]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-2.5 min-h-[44px] bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-lg shadow-purple-600/20"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : isEditMode ? (
                                    'Update Variant'
                                ) : (
                                    `Create ${fields.length} Variant${fields.length > 1 ? 's' : ''}`
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VariantAddEditModal;
