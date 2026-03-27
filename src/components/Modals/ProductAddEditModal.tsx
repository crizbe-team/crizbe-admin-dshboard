import React, { useEffect, useState } from 'react';
import { X, Trash2, Loader2, Upload } from 'lucide-react';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '@/validations/product';
import { useCreateProduct, useUpdateProduct } from '@/queries/use-products';
import { useFetchCategories } from '@/queries/use-categories';

export interface SizeVariant {
    size: string;
    price: string;
    quantity?: string;
}

export type Product = {
    id: string;
    name: string;
    productId: string;
    category: {
        id: string;
        name: string;
    };
    price: string;
    stock: number;
    available_stock?: number;
    sales: number;
    icon: string;
    images?: { image: string }[];
    description?: string;
    ingredients?: string;
    variants?: SizeVariant[];
};

interface Props {
    isModalOpen: boolean;
    editingProduct: Product | null;
    handleCloseModal: () => void;
    categories?: any[];
}

function ProductAddEditModal({
    isModalOpen,
    editingProduct,
    handleCloseModal,
    categories = [],
}: Props) {
    const [categorySearch, setCategorySearch] = useState('');
    const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategories({
        q: categorySearch,
    });
    const categoriesList = categoriesData?.data || categories;

    const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
    const isSubmitting = isCreating || isUpdating;

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImagesList, setExistingImagesList] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            category: '',
            description: '',
            ingredients: '',
        },
    });

    // Reset when modal opens or editingProduct changes
    useEffect(() => {
        if (isModalOpen) {
            if (editingProduct) {
                reset({
                    name: editingProduct.name,
                    category: editingProduct.category?.id || '',
                    description: editingProduct.description || '',
                    ingredients: editingProduct.ingredients || '',
                });
                setExistingImagesList(editingProduct.images?.map((img) => img.image) || []);
                setImagePreviews([]);
                setImageFiles([]);
            } else {
                reset({
                    name: '',
                    category: '',
                    description: '',
                    ingredients: '',
                });
                setExistingImagesList([]);
                setImagePreviews([]);
                setImageFiles([]);
            }
        }
    }, [isModalOpen, editingProduct]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImageFiles((prev) => [...prev, ...files]);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImagesList((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = (data: ProductFormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('category', data.category);
        formData.append('description', data.description);
        formData.append('ingredients', data.ingredients || '');
        formData.append('icon', editingProduct?.icon || '📦');

        // Existing images (urls)
        existingImagesList.forEach((url) => {
            formData.append('existing_images', url);
        });

        // New files
        imageFiles.forEach((file) => {
            formData.append('images', file);
        });

        const mutationOptions = {
            onSuccess: () => {
                handleCloseModal();
                reset();
            },
            onError: (error: any) => {
                if (error?.errors && Object.keys(error.errors).length > 0) {
                    Object.keys(error.errors).forEach((field) => {
                        setError(field as keyof ProductFormData, {
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

        if (editingProduct) {
            updateProduct({ id: editingProduct.id, data: formData }, mutationOptions);
        } else {
            createProduct(formData, mutationOptions);
        }
    };

    const globalError = (errors.root as any)?.serverError?.message;

    if (!isModalOpen) return null;

    return (
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

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    {globalError && (
                        <div className="bg-red-900 bg-opacity-20 border border-red-900 text-red-500 text-sm p-3 rounded-lg">
                            {globalError}
                        </div>
                    )}

                    {/* Images Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">
                            Product Images
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Existing Images */}
                            {existingImagesList.map((url, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                    <img
                                        src={url}
                                        alt="Existing"
                                        className="w-full h-24 object-cover rounded-lg border border-[#3a3a3a]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ))}
                            {/* New Previews */}
                            {imagePreviews.map((url, index) => (
                                <div key={`new-${index}`} className="relative group">
                                    <img
                                        src={url}
                                        alt="Preview"
                                        className="w-full h-24 object-cover rounded-lg border border-purple-500/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ))}
                            {/* Upload Button */}
                            <label className="w-full h-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#3a3a3a] hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer text-gray-500 hover:text-purple-400">
                                <Upload className="w-6 h-6 mb-1" />
                                <span className="text-xs font-medium">Add Images</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Product Name
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                className={`w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border focus:outline-none transition-colors ${
                                    errors.name
                                        ? 'border-red-500'
                                        : 'border-[#3a3a3a] focus:border-purple-500'
                                }`}
                                placeholder="Enter product name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category
                            </label>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <SearchableSelect
                                        options={categoriesList.map((cat: any) => ({
                                            label: cat.name,
                                            value: cat.id,
                                        }))}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onSearchChange={setCategorySearch}
                                        isLoading={isCategoriesLoading}
                                        placeholder="Select Category"
                                    />
                                )}
                            />
                            {errors.category && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
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
                            placeholder="Enter product description"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Ingredients */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Ingredients
                        </label>
                        <textarea
                            {...register('ingredients')}
                            className={`w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border focus:outline-none transition-colors ${
                                errors.ingredients
                                    ? 'border-red-500'
                                    : 'border-[#3a3a3a] focus:border-purple-500'
                            }`}
                            placeholder="Enter product ingredients"
                            rows={4}
                        />
                        {errors.ingredients && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.ingredients.message}
                            </p>
                        )}
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
                            ) : editingProduct ? (
                                'Update Product'
                            ) : (
                                'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductAddEditModal;
