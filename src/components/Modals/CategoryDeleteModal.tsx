import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Category } from './CategoryAddEditModal';

interface Props {
    isDeleteModalOpen: boolean;
    categoryToDelete: Category | null;
    cancelDelete: () => void;
    confirmDeleteCategory: () => void;
    isDeleting?: boolean;
}

function CategoryDeleteModal({
    isDeleteModalOpen,
    categoryToDelete,
    cancelDelete,
    confirmDeleteCategory,
    isDeleting = false,
}: Props) {
    if (!isDeleteModalOpen || !categoryToDelete) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
                <div className="flex items-center gap-4 mb-4">
                    <div className="shrink-0 w-12 h-12 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white font-bricolage">Delete Category</h3>
                        <p className="text-xs text-gray-400">This action cannot be undone.</p>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <p className="text-gray-300 text-sm">
                        Are you sure you want to delete category{' '}
                        <span className="font-bold text-white">"{categoryToDelete.name}"</span>?
                    </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button
                        onClick={cancelDelete}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteCategory}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Delete Category'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryDeleteModal;
