'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ImagePlus, X, Loader2 } from 'lucide-react';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { useUpdateProductReview } from '@/queries/use-products';
import { compressImages } from '@/utils/image-compressor';
import Image from 'next/image';

export interface ReviewItem {
    id: string | number;
    user_name?: string;
    rating: number;
    comment: string;
    images?: Array<{ id: string | number; image: string }>;
}

interface ReviewEditModalProps {
    open: boolean;
    onClose: () => void;
    review: ReviewItem | null;
}

export default function ReviewEditModal({ open, onClose, review }: ReviewEditModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [hovered, setHovered] = useState<number>(0);
    const [userName, setUserName] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [existingImages, setExistingImages] = useState<Array<{ id: string | number; image: string }>>([]);
    const [newPhotos, setNewPhotos] = useState<{ url: string; file: File }[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: updateReview, isPending } = useUpdateProductReview();

    useEffect(() => {
        if (review) {
            setRating(review.rating || 5);
            setUserName(review.user_name || '');
            setComment(review.comment || '');
            setExistingImages(review.images || []);
            setNewPhotos([]);
            setErrorMsg('');
        }
    }, [review]);

    if (!open || !review) return null;

    const handlePhotoAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const compressedFiles = await compressImages(files);
        const availableSlots = 4 - (existingImages.length + newPhotos.length);
        const photosToAdd = compressedFiles.slice(0, Math.max(0, availableSlots)).map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }));
        setNewPhotos((prev) => [...prev, ...photosToAdd]);
        e.target.value = '';
    };

    const removeExistingImage = (imgId: string | number) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
    };

    const removeNewPhoto = (idx: number) => {
        setNewPhotos((prev) => {
            URL.revokeObjectURL(prev[idx].url);
            return prev.filter((_, i) => i !== idx);
        });
    };

    const handleClose = () => {
        newPhotos.forEach((p) => URL.revokeObjectURL(p.url));
        setNewPhotos([]);
        setErrorMsg('');
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            setErrorMsg('Comment is required');
            return;
        }

        const formData = new FormData();
        formData.append('rating', String(rating));
        formData.append('comment', comment);
        if (userName) {
            formData.append('user_name', userName);
        }

        // Keep track of existing image IDs
        existingImages.forEach((img) => {
            formData.append('existing_image_ids', String(img.id));
        });

        // Add newly uploaded files
        newPhotos.forEach((p) => {
            formData.append('images', p.file);
        });

        updateReview(
            { id: review.id, data: formData },
            {
                onSuccess: () => {
                    handleClose();
                },
                onError: (err: any) => {
                    setErrorMsg(err?.message || 'Failed to update review. Please try again.');
                },
            }
        );
    };

    return (
        <ModalWrapper open={open} onClose={handleClose}>
            <div className="relative flex w-full flex-col overflow-hidden bg-[#141414] border border-white/10 shadow-2xl rounded-3xl sm:w-[580px]">
                {/* Header */}
                <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white font-bricolage">Edit Review</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Modify review details & ratings</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                                {errorMsg}
                            </div>
                        )}

                        {/* Customer Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Customer Name..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8BF7A]"
                            />
                        </div>

                        {/* Star Rating */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                                Rating
                            </label>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHovered(star)}
                                        onMouseLeave={() => setHovered(0)}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-7 h-7 transition-colors ${
                                                star <= (hovered || rating)
                                                    ? 'fill-[#E8BF7A] text-[#E8BF7A]'
                                                    : 'text-gray-600'
                                            }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm font-bold text-[#E8BF7A]">
                                    {rating} / 5
                                </span>
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                                Review Comment
                            </label>
                            <textarea
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Edit customer review..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E8BF7A] resize-none"
                            />
                        </div>

                        {/* Photos */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                                Review Photos
                            </label>
                            <div className="flex items-center gap-3 flex-wrap">
                                {/* Existing Images */}
                                {existingImages.map((img) => (
                                    <div
                                        key={img.id}
                                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 group"
                                    >
                                        <img
                                            src={img.image}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(img.id)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center text-white shadow hover:bg-rose-700"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Newly Added Photos */}
                                {newPhotos.map((photo, idx) => (
                                    <div
                                        key={idx}
                                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E8BF7A]/40 group"
                                    >
                                        <Image
                                            src={photo.url}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewPhoto(idx)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center text-white shadow hover:bg-rose-700"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {existingImages.length + newPhotos.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-16 h-16 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 hover:border-[#E8BF7A] hover:text-[#E8BF7A] hover:bg-white/5 transition"
                                    >
                                        <ImagePlus className="w-5 h-5" />
                                        <span className="text-[10px] font-bold mt-1">Add</span>
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
                    <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isPending}
                            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] text-sm font-bold shadow-lg hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ModalWrapper>
    );
}
