import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';

interface VariantToDelete {
    id: string;
    size: string;
    product_detail?: { name: string };
}

interface Props {
    isDeleteModalOpen: boolean;
    variantToDelete: VariantToDelete | null;
    cancelDelete: () => void;
    confirmDeleteVariant: () => void;
    isDeleting?: boolean;
}

function VariantDeleteModal({
    isDeleteModalOpen,
    variantToDelete,
    cancelDelete,
    confirmDeleteVariant,
    isDeleting = false,
}: Props) {
    if (!isDeleteModalOpen || !variantToDelete) return null;

    const displayName = variantToDelete.product_detail?.name
        ? `${variantToDelete.product_detail.name} - ${variantToDelete.size}`
        : variantToDelete.size;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-md mx-4">
                <div className="p-6 border-b border-[#2a2a2a]">
                    <div className="flex items-center space-x-3">
                        <div className="shrink-0 w-12 h-12 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                            <Trash2 className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-100">
                                Delete Variant
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
                        <span className="font-semibold text-white">{displayName}</span>?
                    </p>
                </div>

                <div className="p-6 border-t border-[#2a2a2a] flex justify-end space-x-3">
                    <button
                        onClick={cancelDelete}
                        className="px-4 py-2 bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteVariant}
                        disabled={isDeleting}
                        className="px-4 py-2 min-h-[40px] w-[160px] bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Delete Variant'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VariantDeleteModal;
