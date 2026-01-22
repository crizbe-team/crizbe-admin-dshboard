'use client';

import { useState } from 'react';
import {
    Package,
    Box,
    Layers,
    Search,
    Edit,
    Trash2,
    Plus,
    IndianRupee,
} from 'lucide-react';
import ProductAddEditModal from '@/components/Modals/ProductAddEditModal';
import DeleteModal from '@/components/Modals/DeleteModal';
import { SizeVariant } from '@/components/Modals/ProductAddEditModal';

type Product = {
    id: string;
    name: string;
    productId: string;
    category: string;
    price: string;
    stock: number;
    sales: number;
    icon: string;
    images?: string[];
    description?: string;
    ingredients?: string;
    variants?: SizeVariant[];
};

const initialProducts: Product[] = [
    {
        id: '1',
        name: 'Smartphone',
        productId: '#A7F3D67',
        category: 'Electronics',
        price: '$699.99',
        stock: 120,
        sales: 5200,
        icon: '📱',
    },
    {
        id: '2',
        name: 'Laptop',
        productId: '#B6E4F24',
        category: 'Electronics',
        price: '$1299.99',
        stock: 75,
        sales: 4300,
        icon: '💻',
    },
    {
        id: '3',
        name: 'Mouse',
        productId: '#D4B7C34',
        category: 'Electronics',
        price: '$49.99',
        stock: 180,
        sales: 2500,
        icon: '🖱️',
    },
    {
        id: '4',
        name: 'Keyboard',
        productId: '#F8G9H45',
        category: 'Electronics',
        price: '$79.99',
        stock: 150,
        sales: 1800,
        icon: '⌨️',
    },
    {
        id: '5',
        name: 'Coffee Table',
        productId: '#C5D2A89',
        category: 'Home',
        price: '$249.99',
        stock: 341,
        sales: 3100,
        icon: '🪑',
    },
    {
        id: '6',
        name: 'Sofa',
        productId: '#H7I8J90',
        category: 'Home',
        price: '$899.99',
        stock: 45,
        sales: 1200,
        icon: '🛋️',
    },
    {
        id: '7',
        name: 'Lamp',
        productId: '#K1L2M34',
        category: 'Home',
        price: '$89.99',
        stock: 200,
        sales: 950,
        icon: '💡',
    },
    {
        id: '8',
        name: 'Running Shoes',
        productId: '#E3A5623',
        category: 'Sports',
        price: '$119.99',
        stock: 200,
        sales: 2000,
        icon: '👟',
    },
    {
        id: '9',
        name: 'Yoga Mat',
        productId: '#N4O5P67',
        category: 'Sports',
        price: '$39.99',
        stock: 300,
        sales: 1500,
        icon: '🧘',
    },
    {
        id: '10',
        name: 'Dumbbells',
        productId: '#Q6R7S89',
        category: 'Sports',
        price: '$149.99',
        stock: 80,
        sales: 800,
        icon: '🏋️',
    },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Electronics',
        price: '',
        stock: '',
        icon: '',
        images: [] as string[],
        description: '',
        ingredients: '',
    });

    // Get all unique categories
    const allCategories = ['All', ...Array.from(new Set(products.map(p => p.category))).sort()];

    // Filter products based on selected category and search query
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Calculate statistics
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalSold = products.reduce((sum, p) => sum + p.sales, 0);
    const totalCategories = new Set(products.map(p => p.category)).size;

    const stats = [
        {
            title: 'Total Products',
            value: totalProducts.toLocaleString(),
            icon: Package,
            color: 'text-blue-400',
        },
        {
            title: 'Total Stock',
            value: totalStock.toLocaleString(),
            icon: Box,
            color: 'text-green-400',
        },
        {
            title: 'Total Sold',
            value: totalSold.toLocaleString(),
            icon: IndianRupee,
            color: 'text-purple-400',
        },
        {
            title: 'Total Categories',
            value: totalCategories.toString(),
            icon: Layers,
            color: 'text-orange-400',
        },
    ];

    // Generate unique product ID
    const generateProductId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '#';
        for (let i = 0; i < 7; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Open modal for adding new product
    const handleAddProduct = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            category: 'Electronics',
            price: '',
            stock: '',
            icon: '📦',
            images: [],
            description: '',
            ingredients: '',
        });
        setIsModalOpen(true);
    };

    // Handle multiple image file uploads
    const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newImages: string[] = [];
            let processedCount = 0;

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    newImages.push(result);
                    processedCount++;

                    if (processedCount === files.length) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            images: [...prevFormData.images, ...newImages],
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
        setFormData((prevFormData) => ({
            ...prevFormData,
            images: prevFormData.images.filter((_, i) => i !== index),
        }));
    };

    // Open modal for editing product
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.replace('$', ''),
            stock: product.stock.toString(),
            icon: product.icon,
            images: product.images || [],
            description: product.description || '',
            ingredients: product.ingredients || '',
        });
        setIsModalOpen(true);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Format price
        let productPrice = formData.price;
        if (productPrice && !productPrice.startsWith('$')) {
            productPrice = `$${parseFloat(productPrice).toFixed(2)}`;
        } else if (!productPrice) {
            productPrice = '$0.00';
        }

        const newProduct: Product = {
            id: editingProduct?.id || Date.now().toString(),
            name: formData.name,
            productId: editingProduct?.productId || generateProductId(),
            category: formData.category,
            price: productPrice,
            stock: parseInt(formData.stock),
            sales: editingProduct?.sales || 0,
            icon: formData.icon,
            images: formData.images.length > 0 ? formData.images : undefined,
            description: formData.description || undefined,
            ingredients: formData.ingredients || undefined,
            variants: editingProduct?.variants || undefined,
        };

        if (editingProduct) {
            // Update existing product
            setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
        } else {
            // Add new product
            setProducts([...products, newProduct]);
        }

        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            category: 'Electronics',
            price: '',
            stock: '',
            icon: '📦',
            images: [],
            description: '',
            ingredients: '',
        });
    };

    // Handle delete product - open confirmation modal
    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    // Confirm delete product
    const confirmDeleteProduct = () => {
        if (productToDelete) {
            setProducts(products.filter(p => p.id !== productToDelete.id));
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
        setFormData({
            name: '',
            category: 'Electronics',
            price: '',
            stock: '',
            icon: '📦',
            images: [],
            description: '',
            ingredients: '',
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

            {/* Products List */}
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[#2a2a2a] text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 w-64"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            {allCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleAddProduct}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredProducts.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a2a]">
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">PRODUCT ID</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">NAME</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">CATEGORY</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">SIZE VARIANTS</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">STOCK</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                    >
                                        <td className="p-4 text-gray-300 font-medium">{product.productId}</td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                {product.images && product.images.length > 0 ? (
                                                    <div className="flex items-center space-x-1">
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded-lg border border-[#3a3a3a]"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const iconSpan = e.currentTarget.parentElement?.parentElement?.querySelector('.product-icon');
                                                                if (iconSpan) iconSpan.classList.remove('hidden');
                                                            }}
                                                        />
                                                        {product.images.length > 1 && (
                                                            <span className="text-xs text-gray-400 bg-[#2a2a2a] px-1.5 py-0.5 rounded">
                                                                +{product.images.length - 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : null}
                                                <span className={`text-2xl product-icon ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>{product.icon}</span>
                                                <span className="text-gray-100">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">{product.category}</td>
                                        <td className="p-4">
                                            {product.variants && product.variants.length > 0 ? (
                                                <div className="space-y-1">
                                                    {product.variants.map((variant, idx) => (
                                                        <div key={idx} className="text-xs bg-[#2a2a2a] px-2 py-1 rounded border border-[#3a3a3a]">
                                                            <span className="text-gray-300 font-medium">{variant.size}:</span>
                                                            <span className="text-purple-400 font-semibold ml-1">
                                                                ${parseFloat(variant.price || '0').toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 text-sm">No variants</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-300">{product.stock}</td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
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
                        <div className="p-8 text-center">
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
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                productToDelete={productToDelete}
                cancelDelete={cancelDelete}
                confirmDeleteProduct={confirmDeleteProduct}
            />
        </div>
    );
}

