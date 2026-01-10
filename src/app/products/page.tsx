'use client';

import { useState } from 'react';
import {
    Package,
    Box,
    DollarSign,
    Layers,
    Search,
    Edit,
    Trash2,
    Plus,
    X
} from 'lucide-react';

type Product = {
    id: string;
    name: string;
    productId: string;
    category: string;
    price: string;
    sales: number;
    icon: string;
    image?: string;
};

const initialProducts: Product[] = [
    {
        id: '1',
        name: 'Smartphone',
        productId: '#A7F3D67',
        category: 'Electronics',
        price: '$699.99',
        sales: 5200,
        icon: '📱',
    },
    {
        id: '2',
        name: 'Laptop',
        productId: '#B6E4F24',
        category: 'Electronics',
        price: '$1299.99',
        sales: 4300,
        icon: '💻',
    },
    {
        id: '3',
        name: 'Mouse',
        productId: '#D4B7C34',
        category: 'Electronics',
        price: '$49.99',
        sales: 2500,
        icon: '🖱️',
    },
    {
        id: '4',
        name: 'Keyboard',
        productId: '#F8G9H45',
        category: 'Electronics',
        price: '$79.99',
        sales: 1800,
        icon: '⌨️',
    },
    {
        id: '5',
        name: 'Coffee Table',
        productId: '#C5D2A89',
        category: 'Home',
        price: '$249.99',
        sales: 3100,
        icon: '🪑',
    },
    {
        id: '6',
        name: 'Sofa',
        productId: '#H7I8J90',
        category: 'Home',
        price: '$899.99',
        sales: 1200,
        icon: '🛋️',
    },
    {
        id: '7',
        name: 'Lamp',
        productId: '#K1L2M34',
        category: 'Home',
        price: '$89.99',
        sales: 950,
        icon: '💡',
    },
    {
        id: '8',
        name: 'Running Shoes',
        productId: '#E3A5623',
        category: 'Sports',
        price: '$119.99',
        sales: 2000,
        icon: '👟',
    },
    {
        id: '9',
        name: 'Yoga Mat',
        productId: '#N4O5P67',
        category: 'Sports',
        price: '$39.99',
        sales: 1500,
        icon: '🧘',
    },
    {
        id: '10',
        name: 'Dumbbells',
        productId: '#Q6R7S89',
        category: 'Sports',
        price: '$149.99',
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
        sales: '',
        icon: '',
        image: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

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
            title: 'Total Sold',
            value: totalSold.toLocaleString(),
            icon: DollarSign,
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
            sales: '',
            icon: '📦',
            image: '',
        });
        setImageFile(null);
        setImagePreview('');
        setIsModalOpen(true);
    };

    // Handle image file upload
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData({ ...formData, image: result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Open modal for editing product
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: "Dark Chocolate",
            category: "Snacks",
            price: "99",
            sales: "230",
            icon: "🍫",
            image: "/choco.png",
        });
        setImageFile(null);
        setImagePreview(product.image || '');
        setIsModalOpen(true);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct: Product = {
            id: editingProduct?.id || Date.now().toString(),
            name: formData.name,
            productId: editingProduct?.productId || generateProductId(),
            category: formData.category,
            price: `$${parseFloat(formData.price).toFixed(2)}`,
            sales: parseInt(formData.sales),
            icon: formData.icon,
            image: formData.image || undefined,
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
            sales: '',
            icon: '📦',
            image: '',
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
            sales: '',
            icon: '📦',
            image: '',
        });
        setImageFile(null);
        setImagePreview('');
    };

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">PRICE</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">SALES</th>
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
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-cover rounded-lg border border-[#3a3a3a]"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const iconSpan = e.currentTarget.parentElement?.querySelector('.product-icon');
                                                            if (iconSpan) iconSpan.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : null}
                                                <span className={`text-2xl product-icon ${product.image ? 'hidden' : ''}`}>{product.icon}</span>
                                                <span className="text-gray-100">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">{product.category}</td>
                                        <td className="p-4 text-gray-100 font-semibold">{product.price}</td>
                                        <td className="p-4 text-gray-300">{product.sales.toLocaleString()}</td>
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
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-100">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="Electronics">Electronics</option>
                                        <option value="Home">Home</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Books">Books</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Icon (Emoji)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                        placeholder="📦"
                                        maxLength={2}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Product Image
                                </label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">
                                            Upload Image File
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageFileChange}
                                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-[#3a3a3a]"></span>
                                        </span>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="bg-[#1a1a1a] px-2 text-gray-400">OR</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">
                                            Enter Image URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => {
                                                setFormData({ ...formData, image: e.target.value });
                                                setImagePreview(e.target.value);
                                                setImageFile(null);
                                            }}
                                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-400 mb-1">Image Preview:</p>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-lg border border-[#3a3a3a]"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Sales
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.sales}
                                        onChange={(e) => setFormData({ ...formData, sales: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                >
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && productToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-md mx-4">
                        <div className="p-6 border-b border-[#2a2a2a]">
                            <div className="flex items-center space-x-3">
                                <div className="shrink-0 w-12 h-12 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                                    <Trash2 className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-100">Delete Product</h3>
                                    <p className="text-sm text-gray-400">This action cannot be undone.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-300 mb-4">
                                Are you sure you want to delete <span className="font-semibold text-white">{productToDelete.name}</span>?
                            </p>
                            {productToDelete.image && (
                                <div className="mb-4 flex items-center space-x-3 p-3 bg-[#2a2a2a] rounded-lg">
                                    <img
                                        src={productToDelete.image}
                                        alt={productToDelete.name}
                                        className="w-12 h-12 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    <div>
                                        <p className="text-sm text-gray-300">Product ID: {productToDelete.productId}</p>
                                        <p className="text-sm text-gray-400">Category: {productToDelete.category}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-[#2a2a2a] flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteProduct}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

