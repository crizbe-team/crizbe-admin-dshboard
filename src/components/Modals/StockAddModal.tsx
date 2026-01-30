import React, { useState } from 'react';
import { X } from 'lucide-react';

import SearchableSelect from '@/components/ui/SearchableSelect';

interface Product {
    id: string;
    name: string;
    product_id_code: string;
}

interface Props {
    isModalOpen: boolean;
    handleCloseModal: () => void;
    handleSubmit: (data: any) => void;
    availableProducts: Product[];
    defaultProductId?: string;
}

export default function StockAddModal({
    isModalOpen,
    handleCloseModal,
    handleSubmit,
    availableProducts,
    defaultProductId,
}: Props) {
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        type: 'add',
        notes: '',
    });

    React.useEffect(() => {
        if (isModalOpen) {
            setFormData((prev) => ({
                ...prev,
                productId: defaultProductId || '',
            }));
        }
    }, [isModalOpen, defaultProductId]);

    if (!isModalOpen) return null;

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit({
            ...formData,
            quantity: parseFloat(formData.quantity) || 0,
            date: new Date().toISOString(),
        });
        setFormData({ productId: '', quantity: '', type: 'add', notes: '' });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-lg mx-4">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-100">Add Stock</h2>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onFormSubmit} className="p-6 space-y-4">
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
                            onChange={(value) => setFormData({ ...formData, productId: value })}
                            placeholder="Select a Product"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Quantity (kg)
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0.01"
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData({ ...formData, quantity: e.target.value })
                                }
                                placeholder="e.g. 10"
                                className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Add any notes..."
                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 h-24"
                        />
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
                            Update Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
