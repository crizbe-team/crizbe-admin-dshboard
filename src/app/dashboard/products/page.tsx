'use client';

import { useState, useMemo } from 'react';
import { Package, Box, Layers, Search, Edit, Trash2, Plus, IndianRupee, Eye } from 'lucide-react';
import Link from 'next/link';
import ProductAddEditModal, { SizeVariant, Product } from '@/components/Modals/ProductAddEditModal';
import DeleteModal from '@/components/Modals/DeleteModal';
import DebouncedSearch from '@/components/ui/DebouncedSearch';
import SearchableSelect from '@/components/ui/SearchableSelect';
import {
    useFetchProducts,
    useDeleteProduct,
    useCreateProduct,
    useUpdateProduct,
} from '@/queries/use-products';
import { useFetchCategories } from '@/queries/use-categories';
import Loader from '@/components/ui/loader';

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Fetch Products
    const { data: productsData, isLoading: isProductsLoading } = useFetchProducts({
        q: searchQuery,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
    });

    // Fetch Categories for the dropdown
    const { data: categoriesData } = useFetchCategories();

    // Delete Mutation
    const deleteMutation = useDeleteProduct();
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();

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

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        icon: '',
        images: [] as string[],
        imageFiles: [] as File[],
        description: '',
        ingredients: '',
    });

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
        setFormData({
            name: '',
            category: categoryOptions[1]?.value || '', // Default to first category if available
            price: '',
            stock: '',
            icon: '📦',
            images: [],
            imageFiles: [],
            description: '',
            ingredients: '',
        });
        setIsModalOpen(true);
    };

    // Handle multiple image file uploads
    const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newPreviews: string[] = [];
            let processedCount = 0;

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    newPreviews.push(result);
                    processedCount++;

                    if (processedCount === files.length) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            images: [...prevFormData.images, ...newPreviews],
                            imageFiles: [...prevFormData.imageFiles, ...files],
                        }));
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Handle adding image URL
    const handleImageUrlAdd = (url: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            images: [...prevFormData.images, url],
        }));
    };

    // Handle removing an image
    const handleImageRemove = (index: number) => {
        setFormData((prevFormData) => {
            const isExistingImage =
                index < prevFormData.images.length - prevFormData.imageFiles.length;

            return {
                ...prevFormData,
                images: prevFormData.images.filter((_, i) => i !== index),
                imageFiles: isExistingImage
                    ? prevFormData.imageFiles
                    : prevFormData.imageFiles.filter(
                          (_, i) =>
                              i !==
                              index - (prevFormData.images.length - prevFormData.imageFiles.length)
                      ),
            };
        });
    };

    // Open modal for editing product
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category?.id || '',
            price: (product.price || '').replace('$', ''),
            stock: (product.stock || 0).toString(),
            icon: product.icon,
            images: product.images?.map((img) => img.image) || [],
            imageFiles: [],
            description: product.description || '',
            ingredients: product.ingredients || '',
        });
        setIsModalOpen(true);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('ingredients', formData.ingredients);
        data.append('stock', formData.stock);
        data.append('price', formData.price);
        data.append('icon', formData.icon);

        // Append existing images as strings if any
        const existingImages = formData.images.filter((img) => !img.startsWith('data:'));
        existingImages.forEach((img) => {
            data.append('existing_images', img);
        });

        // Append new image files
        formData.imageFiles.forEach((file) => {
            data.append('images', file);
        });

        try {
            if (editingProduct) {
                await updateMutation.mutateAsync({ id: editingProduct.id, data });
            } else {
                await createMutation.mutateAsync(data);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error('Failed to save product:', error);
        }
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

            {/* Products List */}
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
                                        className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
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
                                                    href={`/dashboard/products/${product.id}`}
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
            </div>

            {/* Add/Edit Product Modal */}
            <ProductAddEditModal
                isModalOpen={isModalOpen}
                editingProduct={editingProduct}
                handleCloseModal={handleCloseModal}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                handleImageFilesChange={handleImageFilesChange}
                handleImageUrlAdd={handleImageUrlAdd}
                handleImageRemove={handleImageRemove}
                categories={categoriesData?.data}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                productToDelete={productToDelete}
                cancelDelete={cancelDelete}
                confirmDeleteProduct={confirmDeleteProduct}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}
