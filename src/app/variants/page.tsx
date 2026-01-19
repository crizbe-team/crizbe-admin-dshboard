'use client';

import { useState } from 'react';
import {
    Tags,
    Search,
    Edit,
    Trash2,
    Plus,
    Package
} from 'lucide-react';
import VariantAddEditModal, { VariantFormData } from '@/components/Modals/VariantAddEditModal';
// Reuse DeleteModal or create a generic one? The existing DeleteModal is Product specific. I'll create a simple one or just reuse the logic with a new modal? 
// For speed, let's create a VariantDeleteModal or just inline it if simple? No, reuse pattern.
// But wait, I can modify DeleteModal to be generic? For now, I'll stick to specific file for safety without breaking existing code.
// Actually, I'll assume I can copy the DeleteModal pattern.

// Mock Products for selection
const availableProducts = [
    { id: '1', name: 'Smartphone', product_id_code: '#A7F3D67' },
    { id: '2', name: 'Laptop', product_id_code: '#B6E4F24' },
    { id: '3', name: 'Mouse', product_id_code: '#D4B7C34' },
    { id: '4', name: 'Keyboard', product_id_code: '#F8G9H45' },
    { id: '5', name: 'Coffee Table', product_id_code: '#C5D2A89' }
];

interface Variant {
    id: string;
    productId: string;
    productName: string;
    size: string;
    price: string;
    quantity: number;
}

const initialVariants: Variant[] = [
    { id: '101', productId: '1', productName: 'Smartphone', size: '128GB', price: '699.99', quantity: 50 },
    { id: '102', productId: '1', productName: 'Smartphone', size: '256GB', price: '799.99', quantity: 30 },
    { id: '201', productId: '3', productName: 'Mouse', size: 'Standard', price: '49.99', quantity: 100 },
];

export default function VariantsPage() {
    const [variants, setVariants] = useState<Variant[]>(initialVariants);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<VariantFormData>({
        productId: '',
        productName: '',
        size: '',
        price: '',
        quantity: ''
    });

    // Filter variants
    const filteredVariants = variants.filter(variant =>
        variant.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        variant.size.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddVariant = () => {
        setFormData({
            productId: '',
            productName: '',
            size: '',
            price: '',
            quantity: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newVariant: Variant = {
            id: Date.now().toString(),
            productId: formData.productId,
            productName: formData.productName,
            size: formData.size,
            price: formData.price,
            quantity: parseInt(formData.quantity) || 0
        };

        setVariants([...variants, newVariant]);
        setIsModalOpen(false);
    };

    const handleDeleteVariant = (id: string) => {
        if(confirm('Are you sure you want to delete this variant?')) {
            setVariants(variants.filter(v => v.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Variants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#2a2a2a] text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 w-64"
                        />
                    </div>
                    <button
                        onClick={handleAddVariant}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Variant</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {filteredVariants.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a2a]">
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">PRODUCT</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">SIZE/VARIANT</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">PRICE</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">QUANTITY</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVariants.map((variant) => (
                                    <tr
                                        key={variant.id}
                                        className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                    >
                                        <td className="p-4 text-gray-100 font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Package className="w-4 h-4 text-gray-500" />
                                                <span>{variant.productName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            <span className="px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-sm">
                                                {variant.size}
                                            </span>
                                        </td>
                                        <td className="p-4 text-purple-400 font-medium">
                                            ${parseFloat(variant.price).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {variant.quantity}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDeleteVariant(variant.id)}
                                                className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-400">No variants found.</p>
                        </div>
                    )}
                </div>
            </div>

            <VariantAddEditModal
                isModalOpen={isModalOpen}
                handleCloseModal={() => setIsModalOpen(false)}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                availableProducts={availableProducts}
            />
        </div>
    );
}
