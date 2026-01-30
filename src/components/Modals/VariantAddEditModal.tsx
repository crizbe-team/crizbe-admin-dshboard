import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import SearchableSelect from '@/components/ui/SearchableSelect';

export interface VariantFormData {
    productId: string;
    productName: string;
    size: string;
    price: string;
    quantity: string;
    weight_per_unit: string;
}

interface Product {
    id: string;
    name: string;
    product_id_code: string; // Renamed to avoid confusion with internal ID
}

interface Props {
    isModalOpen: boolean;
    handleCloseModal: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: VariantFormData;
    setFormData: React.Dispatch<React.SetStateAction<VariantFormData>>;
    availableProducts: Product[];
}

function VariantAddEditModal({
    isModalOpen,
    handleCloseModal,
    handleSubmit,
    formData,
    setFormData,
    availableProducts,
}: Props) {
    if (!isModalOpen) return null;

    const [customSize, setCustomSize] = useState('');
    const [useCustomSize, setUseCustomSize] = useState(false);

    // Default sizes, but user can add custom
    const commonSizes = ['100gm', '200gm', '250gm', '400gm', '500gm', '1kg'];

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProductId = e.target.value;
        const selectedProduct = availableProducts.find((p) => p.id === selectedProductId);
        setFormData({
            ...formData,
            productId: selectedProductId,
            productName: selectedProduct ? selectedProduct.name : '',
        });
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'custom') {
            setUseCustomSize(true);
            setFormData({ ...formData, size: '' });
        } else {
            setUseCustomSize(false);

            // Auto-calculate weight_per_unit based on size
            let weight = '';
            if (val.endsWith('gm')) {
                const num = parseFloat(val.replace('gm', ''));
                if (!isNaN(num)) weight = (num / 1000).toString();
            } else if (val.endsWith('kg')) {
                const num = parseFloat(val.replace('kg', ''));
                if (!isNaN(num)) weight = num.toString();
            }

            setFormData({
                ...formData,
                size: val,
                weight_per_unit: weight || formData.weight_per_unit,
            });
        }
    };

    const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomSize(val);
        setFormData({ ...formData, size: val });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-lg mx-4">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-100">Add New Variant</h2>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Product Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Product
                        </label>
                        <SearchableSelect
                            options={availableProducts.map((p) => ({
                                label: `${p.name} (${p.product_id_code})`,
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
                        />
                    </div>

                    {/* Size Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                        {!useCustomSize ? (
                            <select
                                required
                                value={formData.size}
                                onChange={handleSizeChange}
                                className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                            >
                                <option value="">-- Select Size --</option>
                                {commonSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                                <option value="custom">Custom Size...</option>
                            </select>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    required
                                    value={customSize}
                                    onChange={handleCustomSizeChange}
                                    placeholder="e.g. 750gm"
                                    className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setUseCustomSize(false)}
                                    className="px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: e.target.value })
                                }
                                className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Initial Quantity
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData({ ...formData, quantity: e.target.value })
                                }
                                className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Weight Per Unit (kg)
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            required
                            value={formData.weight_per_unit}
                            onChange={(e) =>
                                setFormData({ ...formData, weight_per_unit: e.target.value })
                            }
                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                            placeholder="e.g. 0.1 for 100gm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter the weight in kg. Example: 100gm = 0.1, 500gm = 0.5, 1kg = 1.0
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            Add Variant
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VariantAddEditModal;
