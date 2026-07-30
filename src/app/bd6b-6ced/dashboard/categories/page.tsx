'use client';

import { useState, useEffect } from 'react';
import {
    Layers,
    Search,
    Edit,
    Trash2,
    Plus,
    CheckCircle,
    XCircle,
    Package,
    Filter,
    RefreshCw,
} from 'lucide-react';
import CategoryAddEditModal, { Category } from '@/components/Modals/CategoryAddEditModal';
import CategoryDeleteModal from '@/components/Modals/CategoryDeleteModal';
import { useFetchCategories, useDeleteCategory } from '@/queries/use-categories';
import DashboardLoader from '@/components/ui/DashboardLoader';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
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

export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isRefetching, refetch } = useFetchCategories({
        q: searchQuery,
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
        page: currentPage,
    });

    const deleteMutation = useDeleteCategory();

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const stats = [
        {
            title: 'Total Categories',
            value: data?.base_data?.total_categories ?? 0,
            icon: Layers,
            color: 'text-[#E8BF7A]',
        },
        {
            title: 'Active Categories',
            value: data?.base_data?.active ?? 0,
            icon: CheckCircle,
            color: 'text-emerald-400',
        },
        {
            title: 'Inactive Categories',
            value: data?.base_data?.inactive ?? 0,
            icon: XCircle,
            color: 'text-rose-400',
        },
        {
            title: 'Total Products',
            value: data?.base_data?.total_products ?? 0,
            icon: Package,
            color: 'text-amber-300',
        },
    ];

    const handleAddCategory = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteCategory = async () => {
        if (categoryToDelete) {
            try {
                await deleteMutation.mutateAsync(categoryToDelete.id);
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
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
                        <Layers className="w-9 h-9 text-[#E8BF7A]" />
                        Category Management
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Organize and manage gourmet chocolate crunch stick product categories.
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
                        onClick={handleAddCategory}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
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

            {/* Categories List Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4 flex-1 min-w-[280px]">
                        <DebouncedSearch
                            onSearch={setSearchQuery}
                            placeholder="Search Categories..."
                            className="max-w-xs"
                        />
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="bg-[#1a1a1a] text-gray-200 text-sm font-semibold pl-4 pr-10 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#E8BF7A] appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <DashboardLoader text="Loading Categories" />
                    ) : data?.data?.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Products</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {data?.data?.map((category: Category) => (
                                    <tr
                                        key={category.id}
                                        className="hover:bg-white/[0.02] transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-[#E8BF7A]/10 border border-[#E8BF7A]/20 flex items-center justify-center text-[#E8BF7A]">
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                                <span className="text-white font-bold max-w-[200px] truncate">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td
                                            className="px-6 py-4 text-gray-400 max-w-xs truncate"
                                            title={category.description || '--'}
                                        >
                                            {category?.description || '--'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition inline-flex items-center gap-1.5 ${
                                                    category.is_active
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${category.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-bold">
                                            {category.productCount ?? 0} products
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditCategory(category)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                                                    title="Edit Category"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category)}
                                                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                                                    title="Delete Category"
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
                            No categories found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {data?.pagination && data.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-white/10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={data.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={data.pagination.has_next}
                            hasPrevious={data.pagination.has_previous}
                        />
                    </div>
                )}
            </motion.div>

            {/* Add/Edit Category Modal */}
            <CategoryAddEditModal
                isModalOpen={isModalOpen}
                editingCategory={editingCategory}
                handleCloseModal={handleCloseModal}
            />

            {/* Delete Confirmation Modal */}
            <CategoryDeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                categoryToDelete={categoryToDelete}
                cancelDelete={cancelDelete}
                confirmDeleteCategory={confirmDeleteCategory}
                isDeleting={deleteMutation.isPending}
            />
        </motion.div>
    );
}
