'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tags, Edit, Trash2, Plus, Package, Box, ShoppingCart } from 'lucide-react';
import VariantAddEditModal, { VariantFormData } from '@/components/Modals/VariantAddEditModal';
import VariantDeleteModal from '@/components/Modals/VariantDeleteModal';
import { useFetchVariants, useDeleteVariant } from '@/queries/use-variants';
import { useFetchProducts } from '@/queries/use-products';
import DashboardLoader from '@/components/ui/DashboardLoader';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Pagination from '@/components/ui/Pagination';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

export default function VariantsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<string>('All');
    const [productSearch, setProductSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch Variants
    const { data: variantsData, isLoading: isVariantsLoading } = useFetchVariants({
        q: searchQuery,
        productId: selectedProduct === 'All' ? undefined : selectedProduct,
        page: currentPage,
    });

    // Fetch Products for the filter dropdown
    const { data: productsData, isLoading: isProductsLoading } = useFetchProducts({
        q: productSearch,
    });

    const productOptions = useMemo(() => {
        const products =
            productsData?.data?.map((p: any) => ({
                label: p.name,
                value: p.id,
            })) || [];
        return [{ label: 'All Products', value: 'All' }, ...products];
    }, [productsData]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedProduct]);

    // Mutations
    const deleteMutation = useDeleteVariant();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState<any | null>(null);
    const [editingVariantData, setEditingVariantData] = useState<VariantFormData | null>(null);

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
        setEditingVariantData(null);
        setIsModalOpen(true);
    };

    const handleEditVariant = (variant: any) => {
        setEditingVariantData({
            productId: variant.product_detail?.id || '',
            productName: variant.product_detail?.name || '',
            variants: [
                {
                    id: variant.id?.toString(),
                    size: variant.size,
                    price: variant.price.toString(),
                    weight_per_unit: (variant.weight_per_unit || '').toString(),
                },
            ],
        });
        setIsModalOpen(true);
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

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5 pb-12"
        >
            {/* Statistics Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    const bgClass = stat.color.includes('blue') ? 'bg-blue-500/10' : stat.color.includes('green') ? 'bg-green-500/10' : stat.color.includes('purple') ? 'bg-purple-500/10' : 'bg-orange-500/10';
                    const glowClass = stat.color.includes('blue') ? 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]' : stat.color.includes('green') ? 'hover:shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]' : stat.color.includes('purple') ? 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]' : 'hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]';
                    return (
                        <div
                            key={stat.title}
                            className={`bg-[#1a1a1a]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 transition-all group relative overflow-hidden ${glowClass}`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                            <div className="flex flex-col h-full justify-between gap-6">
                                <div className="flex items-center justify-between">
                                    <div className={`${bgClass} ${stat.color} p-3.5 rounded-2xl`}>
                                        <Icon className="w-5 h-5 shadow-lg" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-none">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-black text-white font-mono tracking-tighter">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4 flex-1 min-w-[300px]">
                        <DebouncedSearch
                            onSearch={setSearchQuery}
                            placeholder="Search Variants..."
                            className="max-w-xs"
                        />
                        <SearchableSelect
                            options={productOptions}
                            value={selectedProduct}
                            onChange={setSelectedProduct}
                            onSearchChange={setProductSearch}
                            isLoading={isProductsLoading}
                            placeholder="All Products"
                            className="w-48"
                        />
                    </div>
                    <button
                        onClick={handleAddVariant}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Variant</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {isVariantsLoading ? (
                        <div className="p-12 border-t border-white/5">
                            <DashboardLoader text="Loading Variants" />
                        </div>
                    ) : variants.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
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
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
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
                                            ₹{parseFloat(variant.price || '0').toFixed(2)}
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

                {variantsData?.pagination && variantsData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-[#2a2a2a]">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={variantsData.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={variantsData.pagination.has_next}
                            hasPrevious={variantsData.pagination.has_previous}
                        />
                    </div>
                )}
            </motion.div>

            <VariantAddEditModal
                isModalOpen={isModalOpen}
                handleCloseModal={() => setIsModalOpen(false)}
                currentVariantData={editingVariantData}
                isEditMode={!!editingVariantData}
            />

            <VariantDeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                variantToDelete={variantToDelete}
                cancelDelete={cancelDelete}
                confirmDeleteVariant={confirmDeleteVariant}
                isDeleting={deleteMutation.isPending}
            />
        </motion.div>
    );
}
