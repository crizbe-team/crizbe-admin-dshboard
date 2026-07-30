import React, { useEffect, useState } from 'react';
import { X, Trash2, Loader2, Upload, Package } from 'lucide-react';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '@/validations/product';
import { useCreateProduct, useUpdateProduct } from '@/queries/use-products';
import { useFetchCategories } from '@/queries/use-categories';
import { DashboardInput, DashboardTextarea } from '@/components/ui/DashboardFields';

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
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            category: '',
            description: '',
            ingredients: '',
        },
    });

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

        existingImagesList.forEach((url) => {
            formData.append('existing_images', url);
        });

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar my-8">
                <button
                    onClick={handleCloseModal}
                    className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <Package className="w-6 h-6 text-[#E8BF7A]" />
                    <h3 className="text-xl font-bold text-white font-bricolage">
                        {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                    </h3>
                </div>
                <p className="text-gray-400 text-xs mb-6">
                    Configure product attributes, category alignment, and imagery.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {globalError && (
                        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold p-3 rounded-xl">
                            {globalError}
                        </div>
                    )}

                    {/* Images Section */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Product Images
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Existing Images */}
                            {existingImagesList.map((url, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                    <img
                                        src={url}
                                        alt="Existing"
                                        className="w-full h-24 object-cover rounded-xl border border-white/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-1.5 right-1.5 p-1.5 bg-rose-600 hover:bg-rose-700 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-white" />
                                    </button>
                                </div>
                            ))}
                            {/* New Previews */}
                            {imagePreviews.map((url, index) => (
                                <div key={`new-${index}`} className="relative group">
                                    <img
                                        src={url}
                                        alt="Preview"
                                        className="w-full h-24 object-cover rounded-xl border border-[#E8BF7A]/40"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute top-1.5 right-1.5 p-1.5 bg-rose-600 hover:bg-rose-700 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-white" />
                                    </button>
                                </div>
                            ))}
                            {/* Upload Button */}
                            <label className="w-full h-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 hover:border-[#E8BF7A] hover:bg-[#E8BF7A]/5 transition cursor-pointer text-gray-400 hover:text-[#E8BF7A]">
                                <Upload className="w-5 h-5 mb-1" />
                                <span className="text-xs font-bold">Add Images</span>
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
                        <DashboardInput
                            name="name"
                            control={control}
                            label="Product Name"
                            placeholder="e.g. Belgian Chocolate Stick"
                        />

                        <div>
                            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
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
                                <p className="mt-1 text-xs font-semibold text-rose-400">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DashboardTextarea
                        name="description"
                        control={control}
                        label="Description"
                        placeholder="Enter detailed product description..."
                    />

                    <DashboardTextarea
                        name="ingredients"
                        control={control}
                        label="Ingredients"
                        placeholder="e.g. Belgian Chocolate, Roasted Pistachios, Hazelnut Paste"
                    />

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
