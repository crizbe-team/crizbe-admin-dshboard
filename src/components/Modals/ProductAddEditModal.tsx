import React, { useEffect, useState, useRef } from 'react';
import {
    X,
    Trash2,
    Loader2,
    Upload,
    Package,
    Plus,
    Heading2,
    Heading3,
    Bold,
    Italic,
    List,
    HelpCircle,
} from 'lucide-react';
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

export type ProductFaq = {
    question: string;
    answer: string;
};

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
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    meta_details?: {
        meta_title?: string;
        meta_description?: string;
        meta_keywords?: string;
    };
    variants?: SizeVariant[];
    faqs?: ProductFaq[] | string;
    faq_list?: ProductFaq[];
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
    const [faqs, setFaqs] = useState<ProductFaq[]>([]);

    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
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
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
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
                    meta_title:
                        editingProduct.meta_title ||
                        editingProduct.meta_details?.meta_title ||
                        '',
                    meta_description:
                        editingProduct.meta_description ||
                        editingProduct.meta_details?.meta_description ||
                        '',
                    meta_keywords:
                        editingProduct.meta_keywords ||
                        editingProduct.meta_details?.meta_keywords ||
                        '',
                });
                setExistingImagesList(editingProduct.images?.map((img) => img.image) || []);
                setImagePreviews([]);
                setImageFiles([]);

                // Parse FAQs
                let parsedFaqs: ProductFaq[] = [];
                const rawFaqs = (editingProduct as any).faqs ?? (editingProduct as any).faq_list;
                if (rawFaqs) {
                    if (typeof rawFaqs === 'string') {
                        try {
                            parsedFaqs = JSON.parse(rawFaqs);
                        } catch {
                            parsedFaqs = [];
                        }
                    } else if (Array.isArray(rawFaqs)) {
                        parsedFaqs = rawFaqs;
                    }
                }
                setFaqs(Array.isArray(parsedFaqs) ? parsedFaqs : []);
            } else {
                reset({
                    name: '',
                    category: '',
                    description: '',
                    ingredients: '',
                    meta_title: '',
                    meta_description: '',
                    meta_keywords: '',
                });
                setExistingImagesList([]);
                setImagePreviews([]);
                setImageFiles([]);
                setFaqs([]);
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

    const insertFormat = (startTag: string, endTag: string = '') => {
        const textarea = descriptionRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentVal = textarea.value || '';
        const selectedText = currentVal.substring(start, end);
        const replacement = `${startTag}${selectedText || 'Text here'}${endTag}`;

        const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
        setValue('description', newVal, { shouldValidate: true });

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + startTag.length,
                start + startTag.length + (selectedText.length || 9)
            );
        }, 50);
    };

    const addFaqItem = () => {
        setFaqs((prev) => [...prev, { question: '', answer: '' }]);
    };

    const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
        setFaqs((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const removeFaqItem = (index: number) => {
        setFaqs((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = (data: ProductFormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('category', data.category);
        formData.append('description', data.description);
        formData.append('meta_title', data.meta_title || '');
        formData.append('meta_description', data.meta_description || '');
        formData.append('meta_keywords', data.meta_keywords || '');
        formData.append('icon', editingProduct?.icon || '📦');

        const validFaqs = faqs.filter(
            (f) => f.question.trim().length > 0 && f.answer.trim().length > 0
        );
        formData.append('faqs', JSON.stringify(validFaqs));

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
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar my-8">
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
                    Configure rich product attributes, formatted description, ingredients, FAQs, and imagery.
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
                            placeholder="e.g. Hazelnut Crunch Stick"
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

                    {/* Rich Text Editor for About Product / Description */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                                About the Product (Rich HTML Content)
                            </label>
                            <span className="text-[11px] text-gray-400">
                                Use toolbar to format headings &amp; lists
                            </span>
                        </div>

                        {/* Rich Text Formatting Toolbar */}
                        <div className="bg-[#141414] border border-[#333] border-b-0 rounded-t-xl p-2 flex flex-wrap gap-1 items-center">
                            <button
                                type="button"
                                onClick={() => insertFormat('<h2>', '</h2>')}
                                className="p-1.5 text-xs text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition flex items-center gap-1 font-bold"
                                title="Section Heading (H2)"
                            >
                                <Heading2 className="w-4 h-4" /> H2
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<h3>', '</h3>')}
                                className="p-1.5 text-xs text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition flex items-center gap-1 font-bold"
                                title="Sub-Heading (H3)"
                            >
                                <Heading3 className="w-4 h-4" /> H3
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<strong>', '</strong>')}
                                className="p-1.5 text-xs text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Bold Text"
                            >
                                <Bold className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<em>', '</em>')}
                                className="p-1.5 text-xs text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Italic Text"
                            >
                                <Italic className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    insertFormat(
                                        '<ul>\n  <li>',
                                        '</li>\n  <li>Item 2</li>\n</ul>'
                                    )
                                }
                                className="p-1.5 text-xs text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition flex items-center gap-1"
                                title="Bullet List"
                            >
                                <List className="w-4 h-4" /> Bullet List
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('<p>', '</p>')}
                                className="p-1.5 text-xs text-gray-300 hover:text-[#E8BF7A] hover:bg-white/5 rounded transition"
                                title="Paragraph"
                            >
                                Paragraph
                            </button>
                        </div>

                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    ref={(e) => {
                                        field.ref(e);
                                        descriptionRef.current = e;
                                    }}
                                    rows={8}
                                    placeholder="Enter rich HTML description (e.g. <h2>Why You'll Love...</h2> <ul><li>Crispy biscuit rolls</li></ul>)"
                                    className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333] rounded-b-xl text-white text-sm focus:border-[#E8BF7A] focus:outline-none font-mono text-xs leading-relaxed"
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs font-semibold text-rose-400">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Product FAQs Section */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8BF7A] flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4" /> Frequently Asked Questions (FAQs)
                                </h4>
                                <p className="text-[11px] text-gray-400">
                                    Add product-specific FAQs shown on the product detail page
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addFaqItem}
                                className="px-3 py-1.5 rounded-xl bg-[#E8BF7A]/10 border border-[#E8BF7A]/30 text-[#E8BF7A] text-xs font-bold hover:bg-[#E8BF7A]/20 transition flex items-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add FAQ
                            </button>
                        </div>

                        {faqs.length === 0 ? (
                            <div className="p-4 bg-[#141414] border border-[#333] rounded-2xl text-center text-xs text-gray-400">
                                No FAQs added yet. Click &quot;Add FAQ&quot; above to create question-and-answer accordions for this product.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="p-3.5 bg-[#141414] border border-[#333] rounded-2xl space-y-2 relative group"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-bold text-[#E8BF7A] uppercase">
                                                FAQ #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeFaqItem(index)}
                                                className="text-gray-400 hover:text-rose-400 p-1 rounded-lg hover:bg-white/5 transition"
                                                title="Delete FAQ"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            value={faq.question}
                                            onChange={(e) =>
                                                updateFaqItem(index, 'question', e.target.value)
                                            }
                                            placeholder="Question (e.g. What is Crizbe Hazelnut Crunch Stick?)"
                                            className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#333] rounded-xl text-white text-xs font-semibold focus:border-[#E8BF7A] focus:outline-none"
                                        />

                                        <textarea
                                            rows={2}
                                            value={faq.answer}
                                            onChange={(e) =>
                                                updateFaqItem(index, 'answer', e.target.value)
                                            }
                                            placeholder="Answer (e.g. Crizbe Hazelnut Crunch Stick is a crispy biscuit roll coated with milk chocolate...)"
                                            className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#333] rounded-xl text-white text-xs focus:border-[#E8BF7A] focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SEO / Meta Details Section */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E8BF7A]">
                                SEO / Meta Details (Optional)
                            </h4>
                            <span className="text-[11px] text-gray-400">
                                Used for Product Single Page SEO
                            </span>
                        </div>

                        <DashboardInput
                            name="meta_title"
                            control={control}
                            label="Meta Title"
                            placeholder="e.g. Hazelnut Crunch Stick | Crizbe Premium Chocolate"
                        />

                        <DashboardTextarea
                            name="meta_description"
                            control={control}
                            label="Meta Description"
                            placeholder="Enter short meta description for search engines and social sharing..."
                        />

                        <DashboardInput
                            name="meta_keywords"
                            control={control}
                            label="Meta Keywords"
                            placeholder="e.g. Belgian chocolate, crunch stick, luxury snacks, gourmet chocolates"
                        />
                    </div>

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
