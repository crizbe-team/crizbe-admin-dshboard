'use client';

import { useState, useMemo } from 'react';
import { Package, Box, Layers, Edit, Trash2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import ProductAddEditModal, { Product } from '@/components/Modals/ProductAddEditModal';
import DeleteModal from '@/components/Modals/DeleteModal';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useFetchProducts, useDeleteProduct } from '@/queries/use-products';
import { useFetchCategories } from '@/queries/use-categories';
import DashboardLoader from '@/components/ui/DashboardLoader';
import Pagination from '@/components/ui/Pagination';
import { useEffect } from 'react';
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

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch Products
    const { data: productsData, isLoading: isProductsLoading } = useFetchProducts({
        q: searchQuery,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        page: currentPage,
    });

    const [categorySearch, setCategorySearch] = useState('');

    // Fetch Categories for the dropdown
    const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategories({
        q: categorySearch,
    });

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    // Delete Mutation
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
            color: 'text-blue-400',
        },
        {
            title: 'Total Stock',
            value: (baseData.total_stock || 0).toLocaleString(),
            icon: Box,
            color: 'text-green-400',
        },
        {
            title: 'Total Variants',
            value: (baseData.total_variants || 0).toLocaleString(),
            icon: Layers,
            color: 'text-purple-400',
        },
        {
            title: 'Total Categories',
            value: (baseData.total_categories || 0).toString(),
            icon: Layers,
            color: 'text-orange-400',
        },
    ];

    // Open modal for adding new product
    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    // Open modal for editing product
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // Handle delete product - open confirmation modal
    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    // Confirm delete product
    const confirmDeleteProduct = async () => {
        if (productToDelete) {
            await deleteMutation.mutateAsync(productToDelete.id);
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    // Cancel delete
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
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

            {/* Products List */}
            <motion.div variants={itemVariants} className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4 flex-1 min-w-[300px]">
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
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleAddProduct}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isProductsLoading ? (
                        <div className="p-12 border-t border-white/5">
                            <DashboardLoader text="Loading Products" />
                        </div>
                    ) : products.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        NAME
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        CATEGORY
                                    </th>

                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        STOCK
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product: Product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                {product.images && product.images.length > 0 ? (
                                                    <div className="flex items-center space-x-1">
                                                        <img
                                                            src={product.images[0]?.image}
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded-lg border border-[#3a3a3a]"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display =
                                                                    'none';
                                                                const iconSpan =
                                                                    e.currentTarget.parentElement?.parentElement?.querySelector(
                                                                        '.product-icon'
                                                                    );
                                                                if (iconSpan)
                                                                    iconSpan.classList.remove(
                                                                        'hidden'
                                                                    );
                                                            }}
                                                        />
                                                        {product.images.length > 1 && (
                                                            <span className="text-xs text-gray-400 bg-[#2a2a2a] px-1.5 py-0.5 rounded">
                                                                +{product.images.length - 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : null}
                                                <span
                                                    className={`text-2xl product-icon ${product.images && product.images.length > 0 ? 'hidden' : ''}`}
                                                >
                                                    {product.icon}
                                                </span>
                                                <span className="text-gray-100">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {product?.category?.name}
                                        </td>

                                        <td className="p-4 text-gray-300">
                                            {product.available_stock} kg
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/products/${product.id}`}
                                                    className="p-2 bg-purple-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4 text-purple-400" />
                                                </Link>
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="p-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-blue-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product)}
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
                            <p className="text-gray-400">No products found matching your search.</p>
                        </div>
                    )}
                </div>

                {productsData?.pagination && productsData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-[#2a2a2a]">
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
