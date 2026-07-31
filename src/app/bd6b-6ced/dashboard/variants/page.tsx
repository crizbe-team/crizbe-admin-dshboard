'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tags, Edit, Trash2, Plus, Package, Box, ShoppingCart, RefreshCw } from 'lucide-react';
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
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
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

    const { data: variantsData, isLoading: isVariantsLoading, isRefetching, refetch } = useFetchVariants({
        q: searchQuery,
        productId: selectedProduct === 'All' ? undefined : selectedProduct,
        page: currentPage,
    });

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedProduct]);

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
            color: 'text-[#E8BF7A]',
        },
        {
            title: 'Total Stock',
            value: (baseData.total_stock || 0).toLocaleString(),
            icon: Box,
            color: 'text-emerald-400',
        },
        {
            title: 'Total Sold',
            value: (baseData.total_sold || 0).toLocaleString(),
            icon: ShoppingCart,
            color: 'text-amber-300',
        },
        {
            title: 'Total Products',
            value: (baseData.total_products || 0).toString(),
            icon: Package,
            color: 'text-[#E8BF7A]',
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
            className="space-y-8 pb-16 max-w-7xl mx-auto"
        >
            {/* Page Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-bricolage tracking-tight leading-none flex items-center gap-3">
                        <Tags className="w-9 h-9 text-[#E8BF7A]" />
                        Product Variants Management
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Configure size, pack weight, pricing & stock for product variants.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-semibold transition flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>

                    <button
                        onClick={handleAddVariant}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Variant
                    </button>
                </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-[#141414] rounded-3xl p-6 border border-white/10 transition-all hover:border-[#E8BF7A]/30 group relative overflow-hidden shadow-xl"
                        >
                            <div className="flex flex-col h-full justify-between gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-[#E8BF7A]">
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-extrabold text-white font-bricolage tracking-tight">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Variants Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4 flex-1 min-w-[280px]">
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
                </div>

                <div className="overflow-x-auto">
                    {isVariantsLoading ? (
                        <div className="p-12 border-t border-white/5">
                            <DashboardLoader text="Loading Variants" />
                        </div>
                    ) : variants.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Size/Variant</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {variants.map((variant: any) => (
                                    <tr
                                        key={variant.id}
                                        className="hover:bg-white/[0.02] transition"
                                    >
                                        <td className="px-6 py-4 text-white font-bold">
                                            <div className="flex items-center space-x-2">
                                                <Package className="w-4 h-4 text-[#E8BF7A]" />
                                                <span>{variant.product_detail?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-200">
                                                {variant.size}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#E8BF7A] font-bold font-mono text-base">
                                            ₹{parseFloat(variant.price || '0').toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-white font-bold">{variant.stock} units</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditVariant(variant)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                                                    title="Edit Variant"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVariant(variant)}
                                                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                                                    title="Delete Variant"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-400 font-medium">
                            No variants found matching your search.
                        </div>
                    )}
                </div>

                {variantsData?.pagination && variantsData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-white/10">
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
