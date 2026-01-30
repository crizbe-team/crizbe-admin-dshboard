'use client';

import { useMemo, useState } from 'react';
import { Package, Box, Search, Plus, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import StockAddModal from '@/components/Modals/StockAddModal';
import { useFetchStockList, useCreateStock } from '@/queries/use-stock';
import { useFetchProducts } from '@/queries/use-products';
import { useFetchCategories } from '@/queries/use-categories';
import Loader from '@/components/ui/loader';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import SearchableSelect from '@/components/ui/SearchableSelect';

export default function StockPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProductForAdd, setSelectedProductForAdd] = useState<string | undefined>(
        undefined
    );

    // Fetch Stock List
    const { data: stockData, isLoading: isStockLoading } = useFetchStockList({
        q: searchQuery,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        status: selectedStatus === 'All' ? undefined : selectedStatus,
    });

    // Fetch Categories
    const { data: categoriesData } = useFetchCategories();

    // Fetch Products for the modal
    const { data: productsData } = useFetchProducts();

    const createMutation = useCreateStock();

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

    const handleAddStock = async (data: any) => {
        try {
            await createMutation.mutateAsync({
                product: data.productId,
                quantity: data.quantity,
                purchase_price: data.purchase_price,
                notes: data.notes,
                type: 'Addition',
            });
            setIsAddModalOpen(false);
            setSelectedProductForAdd(undefined);
        } catch (error) {
            console.error('Failed to add stock:', error);
        }
    };

    const handleOpenAddStockModal = (productId?: string) => {
        setSelectedProductForAdd(productId);
        setIsAddModalOpen(true);
    };

    const availableProducts =
        productsData?.data?.map((p: any) => ({
            id: p.id,
            name: p.name,
            product_id_code: p.productId,
        })) || [];

    return (
        <div className="space-y-6">
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
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between flex-wrap gap-4">
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
                            placeholder="All Categories"
                            className="w-48"
                        />
                        <SearchableSelect
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
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
                        <div className="p-12 border-t border-[#2a2a2a]">
                            <Loader />
                        </div>
                    ) : products.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a2a]">
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
                                        className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
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
                                                    href={`/dashboard/stock/${product.id}`}
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
            </div>

            <StockAddModal
                isModalOpen={isAddModalOpen}
                handleCloseModal={() => {
                    setIsAddModalOpen(false);
                    setSelectedProductForAdd(undefined);
                }}
                handleSubmit={handleAddStock}
                availableProducts={availableProducts}
                defaultProductId={selectedProductForAdd}
            />
        </div>
    );
}
