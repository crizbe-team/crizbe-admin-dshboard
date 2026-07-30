import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Product } from './ProductAddEditModal';

interface Props {
    isDeleteModalOpen: boolean;
    productToDelete: Product | null;
    cancelDelete: () => void;
    confirmDeleteProduct: () => void;
    isDeleting?: boolean;
}

function DeleteModal({
    isDeleteModalOpen,
    productToDelete,
    cancelDelete,
    confirmDeleteProduct,
    isDeleting = false,
}: Props) {
    if (!isDeleteModalOpen || !productToDelete) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
                <div className="flex items-center gap-4 mb-4">
                    <div className="shrink-0 w-12 h-12 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white font-bricolage">Delete Product</h3>
                        <p className="text-xs text-gray-400">This action cannot be undone.</p>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <p className="text-gray-300 text-sm">
                        Are you sure you want to delete product{' '}
                        <span className="font-bold text-white">"{productToDelete.name}"</span>?
                    </p>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                        {productToDelete.images && productToDelete.images[0] && (
                            <img
                                src={productToDelete.images[0]?.image}
                                alt={productToDelete.name}
                                className="w-10 h-10 object-cover rounded-xl border border-white/10"
                            />
                        )}
                        <div>
                            <p className="text-xs text-gray-300 font-bold">
                                Stock: {productToDelete.available_stock || 0} kg
                            </p>
                            <p className="text-xs text-gray-400 font-medium">
                                Category: {productToDelete.category?.name || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button
                        onClick={cancelDelete}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteProduct}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Delete Product'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
