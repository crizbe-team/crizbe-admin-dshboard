'use client';

import { useState } from 'react';
import { Tags, Search, Edit, Trash2, Plus, Package, Box, ShoppingCart } from 'lucide-react';
import VariantAddEditModal, { VariantFormData } from '@/components/Modals/VariantAddEditModal';
import VariantDeleteModal from '@/components/Modals/VariantDeleteModal';
import {
    useFetchVariants,
    useDeleteVariant,
    useCreateVariant,
    useUpdateVariant,
} from '@/queries/use-variants';
import { useFetchProducts } from '@/queries/use-products';
import Loader from '@/components/ui/loader';
import DebouncedSearch from '@/components/ui/DebouncedSearch';

export default function VariantsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const generateId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return Math.random().toString(36).substring(2, 11);
    };

    // Fetch Variants
    const { data: variantsData, isLoading: isVariantsLoading } = useFetchVariants({
        q: searchQuery,
    });

    // Fetch Products for the modal
    const { data: productsData } = useFetchProducts();

    // Mutations
    const deleteMutation = useDeleteVariant();
    const createMutation = useCreateVariant();
    const updateMutation = useUpdateVariant();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState<any | null>(null);
    const [editingVariant, setEditingVariant] = useState<any | null>(null);
    const [formData, setFormData] = useState<VariantFormData>({
        productId: '',
        productName: '',
        variants: [{ id: 'initial-row', size: '', price: '', weight_per_unit: '' }],
    });

    const variants = variantsData?.data || [];
    const baseData = variantsData?.base_data || {};

    const stats = [
        {
            title: 'Total Variants',
            value: (baseData.total_variants || 0).toLocaleString(),
            icon: Tags,
            color: 'text-blue-400',
        },
        {
            title: 'Total Stock',
            value: (baseData.total_stock || 0).toLocaleString(),
            icon: Box,
            color: 'text-green-400',
        },
        {
            title: 'Total Sold',
            value: (baseData.total_sold || 0).toLocaleString(),
            icon: ShoppingCart,
            color: 'text-purple-400',
        },
        {
            title: 'Total Products',
            value: (baseData.total_products || 0).toString(),
            icon: Package,
            color: 'text-orange-400',
        },
    ];

    const handleAddVariant = () => {
        setEditingVariant(null);
        setFormData({
            productId: '',
            productName: '',
            variants: [{ id: generateId(), size: '', price: '', weight_per_unit: '' }],
        });
        setIsModalOpen(true);
    };

    const handleEditVariant = (variant: any) => {
        setEditingVariant(variant);
        setFormData({
            productId: variant.product_detail?.id || '',
            productName: variant.product_detail?.name || '',
            variants: [
                {
                    id: variant.id?.toString() || generateId(),
                    size: variant.size,
                    price: variant.price.toString(),
                    weight_per_unit: (variant.weight_per_unit || '').toString(),
                },
            ],
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingVariant) {
                const variantData = formData.variants[0];
                const data = {
                    product: formData.productId,
                    size: variantData.size,
                    price: parseFloat(variantData.price) || 0,
                    weight_per_unit: parseFloat(variantData.weight_per_unit) || 0,
                };
                await updateMutation.mutateAsync({ id: editingVariant.id, data });
            } else {
                // Create multiple variants in a single API call
                const data = formData.variants.map((v) => ({
                    product: formData.productId,
                    size: v.size,
                    price: parseFloat(v.price) || 0,
                    weight_per_unit: parseFloat(v.weight_per_unit) || 0,
                }));

                // Assuming the backend supports receiving an array for bulk creation
                // If the backend expects a wrapper object, adjust here.
                await createMutation.mutateAsync(data);
            }
            setIsModalOpen(false);
            setEditingVariant(null);
        } catch (error) {
            console.error('Failed to save variant(s):', error);
        }
    };

    const handleDeleteVariant = (variant: any) => {
        setVariantToDelete(variant);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteVariant = async () => {
        if (!variantToDelete) return;
        try {
            await deleteMutation.mutateAsync(variantToDelete.id);
            setIsDeleteModalOpen(false);
            setVariantToDelete(null);
        } catch (error) {
            console.error('Failed to delete variant:', error);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setVariantToDelete(null);
    };

    const availableProducts =
        productsData?.data?.map((p: any) => ({
            id: p.id,
            name: p.name,
            product_id_code: p.productId,
        })) || [];

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <DebouncedSearch
                        onSearch={setSearchQuery}
                        placeholder="Search Variants..."
                        className="max-w-xs"
                    />
                    <button
                        onClick={handleAddVariant}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Variant</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {isVariantsLoading ? (
                        <div className="p-12 border-t border-[#2a2a2a]">
                            <Loader />
                        </div>
                    ) : variants.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a2a]">
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        PRODUCT
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        SIZE/VARIANT
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        PRICE
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        QUANTITY
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((variant: any) => (
                                    <tr
                                        key={variant.id}
                                        className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                    >
                                        <td className="p-4 text-gray-100 font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Package className="w-4 h-4 text-gray-500" />
                                                <span>{variant.product_detail?.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            <span className="px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-sm">
                                                {variant.size}
                                            </span>
                                        </td>
                                        <td className="p-4 text-purple-400 font-medium">
                                            ${parseFloat(variant.price || '0').toFixed(2)}
                                        </td>
                                        <td className="p-4 text-gray-300">{variant.stock} units</td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditVariant(variant)}
                                                    className="p-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-blue-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVariant(variant)}
                                                    className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center border-t border-[#2a2a2a]">
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
                isSubmitting={createMutation.isPending || updateMutation.isPending}
                isEditMode={!!editingVariant}
            />

            <VariantDeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                variantToDelete={variantToDelete}
                cancelDelete={cancelDelete}
                confirmDeleteVariant={confirmDeleteVariant}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}
