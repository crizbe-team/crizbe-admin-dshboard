import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Tags } from 'lucide-react';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { variantSchema, type VariantFieldValues } from '@/validations/variant';
import { useFetchProducts } from '@/queries/use-products';
import { useCreateVariant, useUpdateVariant } from '@/queries/use-variants';
import { DashboardInput, DashboardSelect } from '@/components/ui/DashboardFields';

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
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm<VariantFieldValues>({
        resolver: zodResolver(variantSchema),
        mode: 'onChange',
        defaultValues: {
            productId: '',
            variants: [{ size: '', price: '', weight_per_unit: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'variants',
    });

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
    }, [isModalOpen, currentVariantData]);

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
                    Object.keys(error.errors).forEach((fieldKey) => {
                        setError(fieldKey as any, {
                            type: 'server',
                            message: error.errors[fieldKey][0],
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

        if (isEditMode && currentVariantData?.variants?.[0]?.id) {
            const variantObj = data.variants[0];
            updateVariant(
                {
                    id: currentVariantData.variants[0].id!,
                    data: {
                        size: variantObj.size,
                        price: parseFloat(variantObj.price),
                        weight_per_unit: parseFloat(variantObj.weight_per_unit),
                    },
                },
                mutationOptions
            );
        } else {
            const payload = {
                product: data.productId,
                variants: data.variants.map((v) => ({
                    size: v.size,
                    price: parseFloat(v.price),
                    weight_per_unit: parseFloat(v.weight_per_unit),
                })),
            };
            createVariant(payload, mutationOptions);
        }
    };

    if (!isModalOpen) return null;

    const globalError = (errors.root as any)?.serverError?.message;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar my-8">
                <button
                    onClick={handleCloseModal}
                    className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <Tags className="w-6 h-6 text-[#E8BF7A]" />
                    <h3 className="text-xl font-bold text-white font-bricolage">
                        {isEditMode ? 'Edit Product Variant' : 'Add Product Variants'}
                    </h3>
                </div>
                <p className="text-gray-400 text-xs mb-6">
                    Configure size weight, price, and attributes for product variants.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {globalError && (
                        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold p-3 rounded-xl">
                            {globalError}
                        </div>
                    )}

                    {/* Product Selection */}
                    <div className="max-w-md">
                        <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                            Target Product
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
                                    placeholder="Search product..."
                                    isDisabled={isEditMode}
                                />
                            )}
                        />
                        {errors.productId && (
                            <p className="mt-1 text-xs font-semibold text-rose-400">
                                {errors.productId.message}
                            </p>
                        )}
                    </div>

                    {/* Variants List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <h4 className="text-xs font-bold text-[#E8BF7A] uppercase tracking-wider">
                                Variant Configuration Matrix
                            </h4>
                            {!isEditMode && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        append({ size: '', price: '', weight_per_unit: '' })
                                    }
                                    className="flex items-center gap-1.5 text-xs font-bold text-[#E8BF7A] bg-[#E8BF7A]/10 hover:bg-[#E8BF7A]/20 px-3 py-1.5 rounded-xl border border-[#E8BF7A]/30 transition"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Another Variant
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 bg-white/5 rounded-2xl border border-white/10 relative group transition hover:border-[#E8BF7A]/30"
                                >
                                    {!isEditMode && fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute -top-2 -right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Size */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                                                Size Variant
                                            </label>
                                            {customSizeStates[index] ? (
                                                <div className="flex items-center space-x-2">
                                                    <DashboardInput
                                                        name={`variants.${index}.size`}
                                                        control={control}
                                                        placeholder="e.g. 750gm"
                                                        onChange={(e) =>
                                                            handleCustomSizeChange(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
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
                                                        className="text-[10px] font-bold text-gray-300 uppercase hover:text-white bg-white/10 px-2 py-2.5 rounded-xl shrink-0"
                                                    >
                                                        Standard
                                                    </button>
                                                </div>
                                            ) : (
                                                <DashboardSelect
                                                    name={`variants.${index}.size`}
                                                    control={control}
                                                    onChange={(e: any) =>
                                                        handleSizeChange(index, e.target.value)
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
                                                </DashboardSelect>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <DashboardInput
                                            name={`variants.${index}.price`}
                                            control={control}
                                            label="Price (₹)"
                                            placeholder="0.00"
                                        />

                                        {/* Weight */}
                                        <DashboardInput
                                            name={`variants.${index}.weight_per_unit`}
                                            control={control}
                                            label="Weight (kg)"
                                            placeholder="0.100"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isEditMode ? (
                                'Update Variant'
                            ) : (
                                `Save ${fields.length} Variant${fields.length > 1 ? 's' : ''}`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VariantAddEditModal;
