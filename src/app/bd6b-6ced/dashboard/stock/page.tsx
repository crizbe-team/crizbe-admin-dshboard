'use client';

import { useMemo, useState } from 'react';
import { Box, Plus, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import StockAddModal from '@/components/Modals/StockAddModal';
import { useFetchStockList } from '@/queries/use-stock';
import { useFetchCategories } from '@/queries/use-categories';
import DashboardLoader from '@/components/ui/DashboardLoader';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Pagination from '@/components/ui/Pagination';

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

    // Fetch Stock List
    const { data: stockData, isLoading: isStockLoading } = useFetchStockList({
        q: searchQuery,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        status: selectedStatus === 'All' ? undefined : selectedStatus,
        page: currentPage,
    });

    // Fetch Categories
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
            color: 'text-blue-400',
        },
        {
            title: 'Low Stock Items',
            value: (baseData.low_stock_items || 0).toLocaleString(),
            icon: ArrowDownRight,
            color: 'text-orange-400',
        },
        {
            title: 'Out of Stock',
            value: (baseData.out_of_stock || 0).toLocaleString(),
            icon: ArrowDownRight,
            color: 'text-red-400',
        },
        {
            title: 'Recently Added',
            value: baseData.recently_added || '0',
            icon: ArrowUpRight,
            color: 'text-green-400',
        },
    ];

    const handleOpenAddStockModal = (productId?: string) => {
        setSelectedProductForAdd(productId);
        setIsAddModalOpen(true);
    };

    return (
        <div className="space-y-5 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
            </div>

            <div className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4 flex-1 min-w-[300px]">
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
                    <button
                        onClick={() => handleOpenAddStockModal()}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Stock</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {isStockLoading ? (
                        <div className="p-12 border-t border-white/5">
                            <DashboardLoader text="Loading Stock" />
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
                                        TOTAL STOCK (kg)
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        STATUS
                                    </th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product: any) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-gray-100">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {product.category_name}
                                        </td>
                                        <td className="p-4 text-gray-300">{product.total_stock}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.status === 'In Stock'
                                                        ? 'bg-green-500 bg-opacity-10 text-green-400'
                                                        : product.status === 'Low Stock'
                                                          ? 'bg-orange-500 bg-opacity-10 text-orange-400'
                                                          : 'bg-red-500 bg-opacity-10 text-red-400'
                                                }`}
                                            >
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleOpenAddStockModal(product.id)
                                                    }
                                                    className="p-2 bg-green-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors text-green-400"
                                                    title="Add Stock"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/bd6b-6ced/dashboard/stock/${product.id}`}
                                                    className="p-2 inline-block bg-purple-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                                                    title="View History"
                                                >
                                                    <Eye className="w-4 h-4 text-purple-400" />
                                                </Link>
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

                {/* Pagination */}
                {stockData?.pagination && stockData.pagination.total_pages > 1 && (
                    <div className="p-4 border-t border-[#2a2a2a]">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={stockData.pagination.total_pages}
                            onPageChange={setCurrentPage}
                            hasNext={stockData.pagination.has_next}
                            hasPrevious={stockData.pagination.has_previous}
                        />
                    </div>
                )}
            </div>

            <StockAddModal
                isModalOpen={isAddModalOpen}
                handleCloseModal={() => {
                    setIsAddModalOpen(false);
                    setSelectedProductForAdd(undefined);
                }}
                defaultProductId={selectedProductForAdd}
            />
        </div>
    );
}
