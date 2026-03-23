'use client';

import React, { useRef, useState } from 'react';
import { Star, ImagePlus, X } from 'lucide-react';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { useCreateProductReview } from '@/queries/use-products';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, type ReviewFormData } from '@/validations/review';
import Image from 'next/image';

interface ReviewAddModalProps {
    open: boolean;
    onClose: () => void;
    productSlug: string;
    productName?: string;
}

export default function ReviewAddModal({
    open,
    onClose,
    productSlug,
    productName,
}: ReviewAddModalProps) {
    const [hovered, setHovered] = useState(0);
    const [photos, setPhotos] = useState<{ url: string; file: File }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: submitReview, isPending } = useCreateProductReview(productSlug);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        formState: { errors },
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: '',
        },
    });

    const rating = watch('rating');
    const globalError = (errors.root as any)?.serverError?.message;

    const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newPhotos = files
            .slice(0, 4 - photos.length)
            .map((file) => ({ url: URL.createObjectURL(file), file }));
        setPhotos((prev) => [...prev, ...newPhotos].slice(0, 4));
        e.target.value = '';
    };

    const removePhoto = (idx: number) => {
        setPhotos((prev) => {
            URL.revokeObjectURL(prev[idx].url);
            return prev.filter((_, i) => i !== idx);
        });
    };

    const handleClose = () => {
        reset();
        setPhotos([]);
        setHovered(0);
        onClose();
    };

    const onSubmit = (data: ReviewFormData) => {
        const formData = new FormData();
        formData.append('rating', String(data.rating));
        formData.append('product', productSlug);
        formData.append('comment', data.comment);
        photos.forEach((p) => formData.append('images', p.file));

        submitReview(formData, {
            onSuccess: () => {
                handleClose();
            },
            onError: (error: any) => {
                if (error?.errors && Object.keys(error.errors).length > 0) {
                    Object.keys(error.errors).forEach((field) => {
                        setError(field as keyof ReviewFormData, {
                            type: 'server',
                            message: error.errors[field][0],
                        });
                    });
                } else {
                    setError('root.serverError' as any, {
                        type: 'server',
                        message: error?.message || 'Something went wrong. Please try again.',
                    });
                }
            },
        });
    };

    return (
        <ModalWrapper open={open} onClose={handleClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Rate & Review"
                className="relative w-[800px] bg-white md:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                style={{ willChange: 'transform, opacity' }}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-[#F0F0F0]">
                    <div>
                        <h2 className="font-semibold text-[18px] text-[#191919]">Rate & Review</h2>
                        <p className="text-[13px] text-[#747474] mt-0.5">
                            Add your review &amp; rating
                            {productName ? ` for ${productName}` : ''}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div
                        className="px-6 py-5 space-y-5 overflow-y-auto"
                        style={{ maxHeight: 'calc(100vh - 220px)' }}
                    >
                        {/* Global / server error */}
                        {globalError && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl">
                                <span className="mt-0.5">⚠</span>
                                <span>{globalError}</span>
                            </div>
                        )}

                        {/* Star Rating */}
                        <Controller
                            control={control}
                            name="rating"
                            render={({ field }) => (
                                <div className="flex items-start gap-6">
                                    <label className="text-[14px] font-medium text-[#191919] pt-1 w-32 shrink-0">
                                        Rate this product
                                        <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHovered(star)}
                                                    onMouseLeave={() => setHovered(0)}
                                                    onClick={() => {
                                                        field.onChange(star);
                                                        setValue('rating', star, {
                                                            shouldValidate: true,
                                                        });
                                                    }}
                                                    className="transition-transform hover:scale-110 focus:outline-none"
                                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                                >
                                                    <Star
                                                        className="w-8 h-8 transition-colors duration-150"
                                                        fill={
                                                            star <= (hovered || field.value)
                                                                ? '#239B44'
                                                                : 'none'
                                                        }
                                                        stroke={
                                                            star <= (hovered || field.value)
                                                                ? '#239B44'
                                                                : errors.rating
                                                                  ? '#EF4444'
                                                                  : '#D1D5DB'
                                                        }
                                                        strokeWidth={1.5}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {errors.rating && (
                                            <p className="mt-1.5 text-xs text-red-500">
                                                {errors.rating.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        />

                        {/* Review Textarea */}
                        <div className="flex items-start gap-6">
                            <label className="text-[14px] font-medium text-[#191919] pt-2 w-32 shrink-0">
                                Add review
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <div className="flex-1">
                                <textarea
                                    {...register('comment')}
                                    rows={4}
                                    placeholder="Share your delightful journey with us! How did our sweet creation make you feel? We'd love to hear your thoughts!"
                                    className={`w-full border rounded-xl px-4 py-3 text-[14px] text-[#191919] placeholder-[#ABABAB] focus:outline-none transition-colors bg-white resize-none leading-relaxed ${
                                        errors.comment
                                            ? 'border-red-400 focus:border-red-400'
                                            : 'border-[#E8E8E8] focus:border-[#C4994A]'
                                    }`}
                                />
                                {errors.comment ? (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.comment.message}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-[11px] text-[#ABABAB] text-right">
                                        {watch('comment')?.length || 0} / 1000
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div className="flex items-start gap-6">
                            <label className="text-[14px] font-medium text-[#191919] pt-1 w-32 shrink-0">
                                Add photos
                            </label>
                            <div className="flex items-center gap-2 flex-wrap">
                                {photos.map((photo, idx) => (
                                    <div
                                        key={idx}
                                        className="relative w-[58px] h-[58px] rounded-lg overflow-hidden border border-[#E8E8E8] group"
                                    >
                                        <Image
                                            src={photo.url}
                                            alt={`Review photo ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(idx)}
                                            className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#191919]/70 rounded-full flex items-center justify-center"
                                        >
                                            <X className="w-2.5 h-2.5 text-white" />
                                        </button>
                                    </div>
                                ))}
                                {photos.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-[58px] h-[58px] rounded-lg border border-dashed border-[#D1D5DB] flex items-center justify-center hover:border-[#C4994A] hover:bg-[#FFF9F0] transition-all"
                                        aria-label="Add photo"
                                    >
                                        <ImagePlus className="w-5 h-5 text-[#ABABAB]" />
                                    </button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handlePhotoAdd}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-[#F0F0F0] flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isPending}
                            className="px-6 py-2.5 rounded-full border border-[#E7E4DD] text-[14px] font-medium text-[#474747] hover:border-[#191919] hover:text-[#191919] transition-all duration-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="relative overflow-hidden px-8 py-2.5 rounded-full text-[14px] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_12px_rgba(196,153,74,0.3)] hover:shadow-[0_6px_16px_rgba(196,153,74,0.4)]"
                            style={{
                                background:
                                    'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-700 hover:left-full ease-out" />
                            <span className="relative z-10">
                                {isPending ? 'Submitting...' : 'Submit'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalWrapper>
    );
}
