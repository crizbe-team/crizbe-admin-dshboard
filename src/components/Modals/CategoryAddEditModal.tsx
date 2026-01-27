import React from 'react';
import { X } from 'lucide-react';
import { useCreateCategory, useUpdateCategory } from '@/queries/use-categories';

export interface CategoryFormData {
    name: string;
    description: string;
    is_active: boolean;
}

export type Category = {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    productCount: number;
};

interface Props {
    isModalOpen: boolean;
    editingCategory: Category | null;
    handleCloseModal: () => void;
    formData: CategoryFormData;
    setFormData: React.Dispatch<React.SetStateAction<CategoryFormData>>;
}

function CategoryAddEditModal({
    isModalOpen,
    editingCategory,
    handleCloseModal,
    formData,
    setFormData,
}: Props) {
    const { mutate } = useCreateCategory();
    const { mutate: updateCategory } = useUpdateCategory();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingCategory) {
            updateCategory(
                {
                    id: editingCategory.id,
                    data: {
                        name: formData.name,
                        description: formData.description,
                        is_active: formData.is_active,
                    },
                },
                {
                    onSuccess: () => {
                        handleCloseModal();
                    },
                }
            );
        } else {
            mutate(formData, {
                onSuccess: () => {
                    handleCloseModal();
                },
            });
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-lg mx-4">
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-100">
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                            Category Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                            placeholder="Enter category name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500"
                            placeholder="Enter category description"
                            rows={4}
                        />
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) =>
                                setFormData({ ...formData, is_active: e.target.checked })
                            }
                            className="w-4 h-4 rounded border-gray-600 bg-[#2a2a2a] text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-300">
                            Active
                        </label>
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
                            {editingCategory ? 'Update Category' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryAddEditModal;
