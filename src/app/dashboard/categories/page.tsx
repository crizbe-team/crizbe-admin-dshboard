'use client';

import { useState } from 'react';
import {
    Layers,
    Search,
    Edit,
    Trash2,
    Plus,
    CheckCircle,
    XCircle,
    Package
} from 'lucide-react';
import CategoryAddEditModal, { Category, CategoryFormData } from '@/components/Modals/CategoryAddEditModal';
import CategoryDeleteModal from '@/components/Modals/CategoryDeleteModal';

const initialCategories: Category[] = [
    {
        id: '1',
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        is_active: true,
        productCount: 156
    },
    {
        id: '2',
        name: 'Home & Living',
        description: 'Furniture, decor, and home essentials',
        is_active: true,
        productCount: 89
    },
    {
        id: '3',
        name: 'Sports',
        description: 'Sports equipment and activewear',
        is_active: true,
        productCount: 45
    },
    {
        id: '4',
        name: 'Fashion',
        description: 'Clothing, shoes, and jewelry',
        is_active: true,
        productCount: 234
    },
    {
        id: '5',
        name: 'Books',
        description: 'Fiction, non-fiction, and educational books',
        is_active: false,
        productCount: 12
    }
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        description: '',
        is_active: true
    });

    // Filter categories based on search query
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate statistics
    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.is_active).length;
    const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

    const stats = [
        {
            title: 'Total Categories',
            value: totalCategories.toString(),
            icon: Layers,
            color: 'text-blue-400',
        },
        {
            title: 'Active Categories',
            value: activeCategories.toString(),
            icon: CheckCircle,
            color: 'text-green-400',
        },
        {
            title: 'Inactive Categories',
            value: (totalCategories - activeCategories).toString(),
            icon: XCircle,
            color: 'text-red-400',
        },
        {
            title: 'Total Products',
            value: totalProducts.toLocaleString(),
            icon: Package,
            color: 'text-purple-400',
        },
    ];

    // Open modal for adding new category
    const handleAddCategory = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            is_active: true
        });
        setIsModalOpen(true);
    };

    // Open modal for editing category
    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            is_active: category.is_active
        });
        setIsModalOpen(true);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newCategory: Category = {
            id: editingCategory?.id || Date.now().toString(),
            name: formData.name,
            description: formData.description,
            is_active: formData.is_active,
            productCount: editingCategory?.productCount || 0
        };

        if (editingCategory) {
            // Update existing category
            setCategories(categories.map(c => c.id === editingCategory.id ? newCategory : c));
        } else {
            // Add new category
            setCategories([...categories, newCategory]);
        }

        handleCloseModal();
    };

    // Handle delete category - open confirmation modal
    const handleDeleteCategory = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    // Confirm delete category
    const confirmDeleteCategory = () => {
        if (categoryToDelete) {
            setCategories(categories.filter(c => c.id !== categoryToDelete.id));
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    // Cancel delete
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            is_active: true
        });
    };

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

            {/* Categories List */}
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#2a2a2a] text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 w-64"
                        />
                    </div>
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {filteredCategories.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a2a]">
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">NAME</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">DESCRIPTION</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">STATUS</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">PRODUCTS</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg bg-purple-900 bg-opacity-30 flex items-center justify-center text-purple-400">
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                                <span className="text-gray-100 font-medium">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300 max-w-xs truncate" title={category.description}>
                                            {category.description}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium border ${
                                                    category.is_active
                                                        ? 'bg-green-900 bg-opacity-20 text-green-400 border-green-900'
                                                        : 'bg-red-900 bg-opacity-20 text-red-400 border-red-900'
                                                }`}
                                            >
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {category.productCount} products
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditCategory(category)}
                                                    className="p-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-blue-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category)}
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
                        <div className="p-8 text-center">
                            <p className="text-gray-400">No categories found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Category Modal */}
            <CategoryAddEditModal
                isModalOpen={isModalOpen}
                editingCategory={editingCategory}
                handleCloseModal={handleCloseModal}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
            />

            {/* Delete Confirmation Modal */}
            <CategoryDeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                categoryToDelete={categoryToDelete}
                cancelDelete={cancelDelete}
                confirmDeleteCategory={confirmDeleteCategory}
            />
        </div>
    );
}
