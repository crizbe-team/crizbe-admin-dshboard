import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import SearchableSelect from '@/components/ui/SearchableSelect';

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
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: VariantFormData;
    setFormData: React.Dispatch<React.SetStateAction<VariantFormData>>;
    availableProducts: Product[];
    isSubmitting?: boolean;
    isEditMode?: boolean;
}

const commonSizes = ['100gm', '200gm', '250gm', '400gm', '500gm', '1kg'];

function VariantAddEditModal({
    isModalOpen,
    handleCloseModal,
    handleSubmit,
    formData,
    setFormData,
    availableProducts,
    isSubmitting = false,
    isEditMode = false,
}: Props) {
    const [customSizeStates, setCustomSizeStates] = useState<Record<string, boolean>>({});

    const generateId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return Math.random().toString(36).substring(2, 11);
    };

    const calculateWeight = (size: string): string | null => {
        const lowerSize = size.toLowerCase().trim();
        // Handle gm and ml (1:1 conversion for weight approximation)
        if (lowerSize.endsWith('gm') || lowerSize.endsWith('ml')) {
            const num = parseFloat(lowerSize.replace(/gm|ml/g, ''));
            if (!isNaN(num)) return (num / 1000).toString();
        }
        // Handle kg and l
        if (lowerSize.endsWith('kg') || lowerSize.endsWith('l')) {
            const num = parseFloat(lowerSize.replace(/kg|l/g, ''));
            if (!isNaN(num)) return num.toString();
        }
        return null;
    };

    const handleAddRow = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                { id: generateId(), size: '', price: '', weight_per_unit: '' },
            ],
        });
    };

    const handleRemoveRow = (id: string) => {
        const updatedVariants = formData.variants.filter((v) => v.id !== id);
        setFormData({ ...formData, variants: updatedVariants });

        // Cleanup custom state for removed row
        const newStates = { ...customSizeStates };
        delete newStates[id];
        setCustomSizeStates(newStates);
    };

    const handleVariantChange = (id: string, field: keyof VariantItem, value: string) => {
        const updatedVariants = formData.variants.map((v) => {
            if (v.id === id) {
                const updated = { ...v, [field]: value };
                // Auto-calculate weight while typing custom size
                if (field === 'size' && customSizeStates[id]) {
                    const weight = calculateWeight(value);
                    if (weight) updated.weight_per_unit = weight;
                }
                return updated;
            }
            return v;
        });
        setFormData({ ...formData, variants: updatedVariants });
    };

    const handleSizeChange = (item: VariantItem, value: string) => {
        const itemId = item.id!;
        if (value === 'custom') {
            setCustomSizeStates({ ...customSizeStates, [itemId]: true });
            handleVariantChange(itemId, 'size', '');
        } else {
            setCustomSizeStates({ ...customSizeStates, [itemId]: false });

            const weight = calculateWeight(value);
            const updatedVariants = formData.variants.map((v) =>
                v.id === itemId
                    ? {
                          ...v,
                          size: value,
                          weight_per_unit: weight || v.weight_per_unit,
                      }
                    : v
            );
            setFormData({ ...formData, variants: updatedVariants });
        }
    };

    // Initialize custom states ONLY when modal opens to avoid resets during typing
    useEffect(() => {
        if (isModalOpen) {
            const initialStates: Record<string, boolean> = {};
            formData.variants.forEach((v) => {
                if (v.size && !commonSizes.includes(v.size)) {
                    initialStates[v.id || ''] = true;
                }
            });
            setCustomSizeStates(initialStates);
        }
    }, [isModalOpen]);

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between shrink-0">
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

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Selection */}
                        <div className="max-w-md">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Select Product
                            </label>
                            <SearchableSelect
                                options={availableProducts.map((p) => ({
                                    label: `${p.name}`,
                                    value: p.id,
                                }))}
                                value={formData.productId}
                                onChange={(value) => {
                                    const selectedProduct = availableProducts.find(
                                        (p) => p.id === value
                                    );
                                    setFormData({
                                        ...formData,
                                        productId: value,
                                        productName: selectedProduct ? selectedProduct.name : '',
                                    });
                                }}
                                placeholder="Select a Product"
                                isDisabled={isEditMode}
                            />
                        </div>

                        {/* Variants List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    Variant Details
                                </h3>
                                {!isEditMode && (
                                    <button
                                        type="button"
                                        onClick={handleAddRow}
                                        className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Row
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {formData.variants.map((variant) => {
                                    const itemId = variant.id!;
                                    return (
                                        <div
                                            key={itemId}
                                            className="p-4 bg-[#212121] rounded-xl border border-[#2a2a2a] relative group"
                                        >
                                            {!isEditMode && formData.variants.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRow(itemId)}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Size */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        Size
                                                    </label>
                                                    {customSizeStates[itemId] ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                required
                                                                autoFocus
                                                                value={variant.size}
                                                                onChange={(e) =>
                                                                    handleVariantChange(
                                                                        itemId,
                                                                        'size',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="e.g. 750gm"
                                                                className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 h-[42px] text-sm rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newStates = {
                                                                        ...customSizeStates,
                                                                    };
                                                                    delete newStates[itemId];
                                                                    setCustomSizeStates(newStates);
                                                                    handleVariantChange(
                                                                        itemId,
                                                                        'size',
                                                                        ''
                                                                    );
                                                                }}
                                                                className="text-xs text-gray-400 hover:text-white"
                                                            >
                                                                Reset
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <select
                                                            required
                                                            value={variant.size}
                                                            onChange={(e) =>
                                                                handleSizeChange(
                                                                    variant,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 h-[42px] text-sm rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                                        >
                                                            <option value="">
                                                                -- Select Size --
                                                            </option>
                                                            {commonSizes.map((size) => (
                                                                <option key={size} value={size}>
                                                                    {size}
                                                                </option>
                                                            ))}
                                                            <option value="custom">
                                                                Custom Size...
                                                            </option>
                                                        </select>
                                                    )}
                                                </div>

                                                {/* Price */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        Price ($)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        required
                                                        value={variant.price}
                                                        onChange={(e) =>
                                                            handleVariantChange(
                                                                itemId,
                                                                'price',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 h-[42px] text-sm rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                                        placeholder="0.00"
                                                    />
                                                </div>

                                                {/* Weight */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        Weight (kg)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.001"
                                                        required
                                                        value={variant.weight_per_unit}
                                                        onChange={(e) =>
                                                            handleVariantChange(
                                                                itemId,
                                                                'weight_per_unit',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 h-[42px] text-sm rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                                        placeholder="0.1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-[#2a2a2a]">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 min-h-[40px] bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : isEditMode ? (
                                    'Update Variant'
                                ) : (
                                    `Create ${formData.variants.length} Variant${formData.variants.length > 1 ? 's' : ''}`
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
