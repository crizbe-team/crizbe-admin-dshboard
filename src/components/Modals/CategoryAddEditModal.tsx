import React, { useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { useCreateCategory, useUpdateCategory } from '@/queries/use-categories';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '@/validations/category';

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
}

function CategoryAddEditModal({ isModalOpen, editingCategory, handleCloseModal }: Props) {
    const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
    const isSubmitting = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            description: '',
            is_active: true,
        },
    });

    // Reset form when modal opens or editingCategory changes
    useEffect(() => {
        if (isModalOpen) {
            if (editingCategory) {
                reset({
                    name: editingCategory.name,
                    description: editingCategory.description || '',
                    is_active: editingCategory.is_active,
                });
            } else {
                reset({
                    name: '',
                    description: '',
                    is_active: true,
                });
            }
        }
    }, [isModalOpen, editingCategory, reset]);

    const onSubmit = (data: CategoryFormData) => {
        const mutationOptions = {
            onSuccess: () => {
                handleCloseModal();
                reset();
            },
            onError: (error: any) => {
                if (error?.errors && Object.keys(error.errors).length > 0) {
                    // Map field-specific errors from API
                    Object.keys(error.errors).forEach((field) => {
                        setError(field as keyof CategoryFormData, {
                            type: 'server',
                            message: error.errors[field][0],
                        });
                    });
                } else {
                    // Global error
                    setError('root.serverError' as any, {
                        type: 'server',
                        message: error?.message || 'Something went wrong. Please try again.',
                    });
                }
            },
        };

        if (editingCategory) {
            updateCategory(
                {
                    id: editingCategory.id,
                    data: data,
                },
                mutationOptions
            );
        } else {
            createCategory(data, mutationOptions);
        }
    };

    if (!isModalOpen) return null;

    const globalError = (errors.root as any)?.serverError?.message;

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

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    {globalError && (
                        <div className="bg-red-900 bg-opacity-20 border border-red-900 text-red-500 text-sm p-3 rounded-lg">
                            {globalError}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Category Name
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            className={`w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border focus:outline-none transition-colors ${
                                errors.name
                                    ? 'border-red-500'
                                    : 'border-[#3a3a3a] focus:border-purple-500'
                            }`}
                            placeholder="Enter category name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            className={`w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border focus:outline-none transition-colors ${
                                errors.description
                                    ? 'border-red-500'
                                    : 'border-[#3a3a3a] focus:border-purple-500'
                            }`}
                            placeholder="Enter category description"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            {...register('is_active')}
                            className="w-4 h-4 rounded border-gray-600 bg-[#2a2a2a] text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <label
                            htmlFor="is_active"
                            className="text-sm font-medium text-gray-300 cursor-pointer"
                        >
                            Active
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 min-h-[40px] w-[160px] bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : editingCategory ? (
                                'Update Category'
                            ) : (
                                'Add Category'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryAddEditModal;
