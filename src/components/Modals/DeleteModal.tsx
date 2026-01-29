import React from 'react';
import { Trash2 } from 'lucide-react';
import { Product } from './ProductAddEditModal';

interface props {
    isDeleteModalOpen: boolean;
    productToDelete: Product | null;
    cancelDelete: () => void;
    confirmDeleteProduct: () => void;
}

function DeleteModal({
    isDeleteModalOpen,
    productToDelete,
    cancelDelete,
    confirmDeleteProduct,
}: props) {
    console.log(productToDelete, 'productToDeleteproductToDelete');
    return (
        <>
            {isDeleteModalOpen && productToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-md mx-4">
                        <div className="p-6 border-b border-[#2a2a2a]">
                            <div className="flex items-center space-x-3">
                                <div className="shrink-0 w-12 h-12 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                                    <Trash2 className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-100">
                                        Delete Product
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-300 mb-4">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-white">
                                    {productToDelete.name}
                                </span>
                                ?
                            </p>
                            {productToDelete.images && productToDelete.images.length > 0 && (
                                <div className="mb-4 p-3 bg-[#2a2a2a] rounded-lg">
                                    <div className="flex items-center space-x-3 mb-2">
                                        {productToDelete.images[0] && (
                                            <img
                                                src={productToDelete.images[0]?.image}
                                                alt={productToDelete.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-300">
                                                Product Stock: {productToDelete.available_stock}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Category: {productToDelete.category?.name}
                                            </p>
                                            {productToDelete.images.length > 1 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {productToDelete.images.length} images
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {productToDelete.images.length > 1 && (
                                        <div className="flex space-x-1 mt-2">
                                            {productToDelete.images
                                                .slice(1, 4)
                                                .map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image.image}
                                                        alt={`${productToDelete.name} ${index + 2}`}
                                                        className="w-8 h-8 object-cover rounded border border-[#3a3a3a]"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ))}
                                            {productToDelete.images.length > 4 && (
                                                <div className="w-8 h-8 bg-[#3a3a3a] rounded border border-[#3a3a3a] flex items-center justify-center">
                                                    <span className="text-xs text-gray-400">
                                                        +{productToDelete.images.length - 4}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
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
        </>
    );
}

export default DeleteModal;
