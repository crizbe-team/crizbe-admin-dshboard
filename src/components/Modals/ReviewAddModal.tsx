'use client';

import React, { useRef, useState } from 'react';
import { Star, ImagePlus, X } from 'lucide-react';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import Image from 'next/image';

interface ReviewAddModalProps {
    open: boolean;
    onClose: () => void;
    productName?: string;
}

export default function ReviewAddModal({ open, onClose, productName }: ReviewAddModalProps) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [review, setReview] = useState('');
    const [photos, setPhotos] = useState<{ url: string; file: File }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        setRating(0);
        setHovered(0);
        setReview('');
        setPhotos([]);
        onClose();
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
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="font-[var(--font-inter-tight)] font-semibold text-[18px] text-[#191919]">
                                Rate & Review
                            </h2>
                            <p className="text-[13px] text-[#747474] mt-0.5">
                                Add your review &amp; rating
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div
                    className="px-6 py-5 space-y-5 overflow-y-auto"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                >
                    {/* Star Rating */}
                    <div className="flex items-start gap-6">
                        <label className="font-[var(--font-inter-tight)] text-[14px] font-medium text-[#191919] pt-1 w-32 shrink-0">
                            Rate this product
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                >
                                    <Star
                                        className="w-8 h-8 transition-colors duration-150"
                                        fill={star <= (hovered || rating) ? '#239B44' : 'none'}
                                        stroke={star <= (hovered || rating) ? '#239B44' : '#D1D5DB'}
                                        strokeWidth={1.5}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Textarea */}
                    <div className="flex items-start gap-6">
                        <label className="font-[var(--font-inter-tight)] text-[14px] font-medium text-[#191919] pt-2 w-32 shrink-0">
                            Add review
                        </label>
                        <textarea
                            rows={4}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your delightful journey with us! How did our sweet creation make you feel? We'd love to hear your thoughts!"
                            className="flex-1 border border-[#E8E8E8] rounded-xl px-4 py-3 text-[14px] text-[#191919] placeholder-[#ABABAB] focus:outline-none focus:border-[#C4994A] transition-colors bg-white resize-none leading-relaxed"
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="flex items-start gap-6">
                        <label className="font-[var(--font-inter-tight)] text-[14px] font-medium text-[#191919] pt-1 w-32 shrink-0">
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
                        className="px-6 py-2.5 rounded-full border border-[#E7E4DD] text-[14px] font-medium text-[#474747] hover:border-[#191919] hover:text-[#191919] transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={rating === 0}
                        className="relative overflow-hidden px-8 py-2.5 rounded-full text-[14px] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_12px_rgba(196,153,74,0.3)] hover:shadow-[0_6px_16px_rgba(196,153,74,0.4)]"
                        style={{
                            background:
                                'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                        }}
                    >
                        <div className="pointer-events-none absolute inset-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-700 hover:left-full ease-out" />
                        <span className="relative z-10">Submit</span>
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}
