'use client';

import { useState, useMemo, useEffect } from 'react';
import { Package, Box, Layers, Edit, Trash2, Plus, Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import ProductAddEditModal, { Product } from '@/components/Modals/ProductAddEditModal';
import DeleteModal from '@/components/Modals/DeleteModal';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useFetchProducts, useDeleteProduct } from '@/queries/use-products';
import { useFetchCategories } from '@/queries/use-categories';
import DashboardLoader from '@/components/ui/DashboardLoader';
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

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: productsData, isLoading: isProductsLoading, isRefetching, refetch } = useFetchProducts({
        q: searchQuery,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        page: currentPage,
    });

    const [categorySearch, setCategorySearch] = useState('');

    const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategories({
        q: categorySearch,
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const deleteMutation = useDeleteProduct();

    const categoryOptions = useMemo(() => {
        const cats =
            categoriesData?.data?.map((cat: any) => ({
                label: cat.name,
                value: cat.id,
            })) || [];
        return [{ label: 'All Categories', value: 'All' }, ...cats];
    }, [categoriesData]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const products = productsData?.data || [];
    const baseData = productsData?.base_data || {};

    const stats = [
        {
            title: 'Total Products',
            value: (baseData.total_products || 0).toLocaleString(),
            icon: Package,
            color: 'text-[#E8BF7A]',
        },
        {
            title: 'Total Stock',
            value: (baseData.total_stock || 0).toLocaleString(),
            icon: Box,
            color: 'text-emerald-400',
        },
        {
            title: 'Total Variants',
            value: (baseData.total_variants || 0).toLocaleString(),
            icon: Layers,
            color: 'text-amber-300',
        },
        {
            title: 'Total Categories',
            value: (baseData.total_categories || 0).toString(),
            icon: Layers,
            color: 'text-purple-400',
        },
    ];

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteProduct = async () => {
        if (productToDelete) {
            await deleteMutation.mutateAsync(productToDelete.id);
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
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
                        <Package className="w-9 h-9 text-[#E8BF7A]" />
                        Products Management
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Manage Crizbe gourmet chocolate products, stock levels & variants.
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
                        onClick={handleAddProduct}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
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

            {/* Products List Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4 flex-1 min-w-[280px]">
                        <DebouncedSearch
                            onSearch={setSearchQuery}
                            placeholder="Search Products..."
                            className="max-w-xs"
                        />
                        <SearchableSelect
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            onSearchChange={setCategorySearch}
                            isLoading={isCategoriesLoading}
                            placeholder="All Categories"
                            className="w-48"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isProductsLoading ? (
                        <div className="p-12 border-t border-white/5">
                            <DashboardLoader text="Loading Products" />
                        </div>
                    ) : products.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {products.map((product: Product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-white/[0.02] transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                {product.images && product.images.length > 0 ? (
                                                    <div className="flex items-center space-x-1">
                                                        <img
                                                            src={product.images[0]?.image}
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded-xl border border-white/10"
                                                        />
                                                    </div>
                                                ) : null}
                                                <span className="text-white font-bold text-base">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-semibold">
                                            {product?.category?.name || '--'}
                                        </td>

                                        <td className="px-6 py-4 text-[#E8BF7A] font-bold font-mono text-base">
                                            {product.available_stock} kg
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/products/${product.id}`}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4 text-[#E8BF7A]" />
                                                </Link>
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                                                    title="Edit Product"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product)}
                                                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                                                    title="Delete Product"
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
                            No products found matching your search.
                        </div>
                    )}
                </div>

                {productsData?.pagination && productsData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-white/10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={productsData.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={productsData.pagination.has_next}
                            hasPrevious={productsData.pagination.has_previous}
                        />
                    </div>
                )}
            </motion.div>

            {/* Add/Edit Product Modal */}
            <ProductAddEditModal
                isModalOpen={isModalOpen}
                editingProduct={editingProduct}
                handleCloseModal={handleCloseModal}
                categories={categoriesData?.data}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                productToDelete={productToDelete}
                cancelDelete={cancelDelete}
                confirmDeleteProduct={confirmDeleteProduct}
                isDeleting={deleteMutation.isPending}
            />
        </motion.div>
    );
}
