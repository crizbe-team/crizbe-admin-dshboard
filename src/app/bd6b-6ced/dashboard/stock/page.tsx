'use client';

import { useMemo, useState } from 'react';
import { Box, Plus, Eye, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import StockAddModal from '@/components/Modals/StockAddModal';
import { useFetchStockList } from '@/queries/use-stock';
import { useFetchCategories } from '@/queries/use-categories';
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

export default function StockPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categorySearch, setCategorySearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProductForAdd, setSelectedProductForAdd] = useState<string | undefined>(
        undefined
    );

    const {
        data: stockData,
        isLoading: isStockLoading,
        isRefetching,
        refetch,
    } = useFetchStockList({
        q: searchQuery,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        status: selectedStatus === 'All' ? undefined : selectedStatus,
        page: currentPage,
    });

    const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategories({
        q: categorySearch,
    });

    const categoryOptions = useMemo(() => {
        const cats =
            categoriesData?.data?.map((cat: any) => ({
                label: cat.name,
                value: cat.id,
            })) || [];
        return [{ label: 'All Categories', value: 'All' }, ...cats];
    }, [categoriesData]);

    const statusOptions = [
        { label: 'All Status', value: 'All' },
        { label: 'In Stock', value: 'In Stock' },
        { label: 'Low Stock', value: 'Low Stock' },
        { label: 'Out of Stock', value: 'Out of Stock' },
    ];

    const products = stockData?.data || [];
    const baseData = stockData?.base_data || {};

    const stats = [
        {
            title: 'Total Stock',
            value: (baseData.total_stock || 0).toLocaleString(),
            icon: Box,
            color: 'text-[#E8BF7A]',
        },
        {
            title: 'Low Stock Items',
            value: (baseData.low_stock_items || 0).toLocaleString(),
            icon: ArrowDownRight,
            color: 'text-amber-300',
        },
        {
            title: 'Out of Stock',
            value: (baseData.out_of_stock || 0).toLocaleString(),
            icon: ArrowDownRight,
            color: 'text-rose-400',
        },
        {
            title: 'Recently Added',
            value: baseData.recently_added || '0',
            icon: ArrowUpRight,
            color: 'text-emerald-400',
        },
    ];

    const handleOpenAddStockModal = (productId?: string) => {
        setSelectedProductForAdd(productId);
        setIsAddModalOpen(true);
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
                        <Box className="w-9 h-9 text-[#E8BF7A]" />
                        Inventory & Stock Management
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Monitor stock levels, track inventory history & update product batches.
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
                        onClick={() => handleOpenAddStockModal()}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Stock
                    </button>
                </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
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

            {/* Stock List Table */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4 flex-1 min-w-[280px]">
                        <DebouncedSearch
                            onSearch={(val) => {
                                setSearchQuery(val);
                                setCurrentPage(1);
                            }}
                            placeholder="Search Products..."
                            className="max-w-xs"
                        />
                        <SearchableSelect
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={(val) => {
                                setSelectedCategory(val);
                                setCurrentPage(1);
                            }}
                            onSearchChange={setCategorySearch}
                            isLoading={isCategoriesLoading}
                            placeholder="All Categories"
                            className="w-48"
                        />
                        <SearchableSelect
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={(val) => {
                                setSelectedStatus(val);
                                setCurrentPage(1);
                            }}
                            placeholder="All Status"
                            className="w-48"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isStockLoading ? (
                        <div className="p-12 border-t border-white/5">
                            <DashboardLoader text="Loading Stock" />
                        </div>
                    ) : products.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Total Stock (kg)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {products.map((product: any) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-white/[0.02] transition"
                                    >
                                        <td className="px-6 py-4 text-white font-bold">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-semibold">
                                            {product.category_name}
                                        </td>
                                        <td className="px-6 py-4 text-[#E8BF7A] font-bold font-mono text-base">
                                            {product.total_stock}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition inline-flex items-center gap-1.5 ${
                                                    product.status === 'In Stock'
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                        : product.status === 'Low Stock'
                                                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        product.status === 'In Stock'
                                                            ? 'bg-emerald-400'
                                                            : product.status === 'Low Stock'
                                                              ? 'bg-amber-400'
                                                              : 'bg-rose-400'
                                                    }`}
                                                />
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleOpenAddStockModal(product.id)
                                                    }
                                                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                                                    title="Add Stock Batch"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/stock/${product.id}`}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                                                    title="View History"
                                                >
                                                    <Eye className="w-4 h-4 text-[#E8BF7A]" />
                                                </Link>
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

                {stockData?.pagination && stockData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-white/10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={stockData.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={stockData.pagination.has_next}
                            hasPrevious={stockData.pagination.has_previous}
                        />
                    </div>
                )}
            </motion.div>

            <StockAddModal
                isModalOpen={isAddModalOpen}
                handleCloseModal={() => {
                    setIsAddModalOpen(false);
                    setSelectedProductForAdd(undefined);
                }}
                defaultProductId={selectedProductForAdd}
            />
        </motion.div>
    );
}
