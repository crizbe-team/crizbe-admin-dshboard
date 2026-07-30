import React, { useEffect } from 'react';
import { Loader2, X, Layers } from 'lucide-react';
import { useCreateCategory, useUpdateCategory } from '@/queries/use-categories';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '@/validations/category';
import {
    DashboardInput,
    DashboardTextarea,
    DashboardCheckbox,
} from '@/components/ui/DashboardFields';

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
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            is_active: true,
        },
    });

    useEffect(() => {
        if (isModalOpen) {
            const defaultValues = editingCategory
                ? {
                      name: editingCategory.name,
                      description: editingCategory.description || '',
                      is_active: editingCategory.is_active,
                  }
                : {
                      name: '',
                      description: '',
                      is_active: true,
                  };
            reset(defaultValues);
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
                    Object.keys(error.errors).forEach((field) => {
                        setError(field as any, {
                            type: 'server',
                            message: error.errors[field][0],
                        });
                    });
                } else {
                    setError('root.serverError' as any, {
                        type: 'server',
                        message: error?.message || 'Something went wrong.',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
                <button
                    onClick={handleCloseModal}
                    className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <Layers className="w-6 h-6 text-[#E8BF7A]" />
                    <h3 className="text-xl font-bold text-white font-bricolage">
                        {editingCategory ? 'Edit Product Category' : 'Add New Category'}
                    </h3>
                </div>
                <p className="text-gray-400 text-xs mb-6">
                    Define category details for Crizbe gourmet products.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {globalError && (
                        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold p-3 rounded-xl">
                            {globalError}
                        </div>
                    )}

                    <DashboardInput
                        name="name"
                        control={control}
                        label="Category Name"
                        placeholder="e.g. Gourmet Crunch Sticks"
                    />

                    <DashboardTextarea
                        name="description"
                        control={control}
                        label="Description"
                        placeholder="Enter category description..."
                    />

                    <DashboardCheckbox name="is_active" control={control} label="Active Category" />

                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
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
