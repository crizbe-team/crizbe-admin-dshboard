import React from 'react'
import { X, Trash2 } from 'lucide-react';

export interface SizeVariant {
    size: string;
    price: string;
    quantity?: string; // Made optional or string to match usage in other files if needed
}

interface ProductFormData {
    name: string;
    category: string;
    icon: string;
    images: string[];
    // price: string; 
    // Wait, in original code price was removed from form?
    // In step 52:
    // price: string;
    // stock: string;
    // ...
    // But in the logic:
    // const newProduct: Product = { ... price: productPrice, ... }
    // where productPrice was calculated from variants.
    // If I remove variants, I MUST add a base Price field?
    // User said "add without adding variants".
    // Usually a product has a price.
    // In original code (step 11/14), there was no "base price" input in the form?
    // Line 278: `price: '', // Base price removed` in `handleEditProduct`.
    // And inputs: `Product Name`, `Category`, `Stock`, `Description`, `Ingredients`.
    // NO PRICE INPUT!
    // It relied on variants for price. `productPrice = ... variants[0].price`.
    // If I remove variants, I NEED A PRICE INPUT.
    // "product and then we can add the variuant with gmsize,amount, quantity".
    // If the product itself doesn't have a price (only variants do), then creating a product without variants implies it has NO price?
    // Or maybe a base price?
    // I should add a Price field to the main product form if variants are removed.
    // User didn't explicitly ask for Price field, but "add without variants" implies the product exists.
    // If I don't add price, price will be 0.
    // I will ADD a Price field to be safe.
    
    price: string;
    stock: string;
    description: string;
    ingredients: string;
}

type Product = {
    id: string;
    name: string;
    productId: string;
    category: string;
    price: string;
    stock: number;
    images?: string[];
    description?: string;
    ingredients?: string;
    variants?: SizeVariant[];
};

interface Props {
    isModalOpen: boolean;
    editingProduct: Product | null;
    handleCloseModal: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: ProductFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
    handleImageFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageUrlAdd: (url: string) => void;
    handleImageRemove: (index: number) => void;
}

function ProductAddEditModal({ isModalOpen, editingProduct, handleCloseModal, handleSubmit, formData, setFormData, handleImageFilesChange, handleImageUrlAdd, handleImageRemove }: Props) {
    
    return (
        <>
            {
                isModalOpen && (
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
                                        Product Images
                                    </label>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">
                                                Upload Image Files (Multiple)
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageFilesChange}
                                                className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                            />
                                        </div>
                                        {formData.images && formData.images.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-xs text-gray-400 mb-2">Images ({formData.images.length}):</p>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {formData.images.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={image}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-20 object-cover rounded-lg border border-[#3a3a3a]"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageRemove(index)}
                                                                className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 className="w-3 h-3 text-white" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 ">
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Category
                                        </label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full  bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                        >
                                            <option value="Electronics">Electronics</option>
                                            <option value="Home">Home</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Fashion">Fashion</option>
                                            <option value="Books">Books</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Stock
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                        placeholder="Enter product description"
                                        rows={4}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Ingredients
                                    </label>
                                    <textarea
                                        value={formData.ingredients || ''}
                                        onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                                        placeholder="Enter product ingredients"
                                        rows={4}
                                    />
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
                )
            }

        </>
    )
}

export default ProductAddEditModal