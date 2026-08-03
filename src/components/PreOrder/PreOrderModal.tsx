'use client';

import React, { useState } from 'react';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import FormInput from '@/components/ui/FormInput';
import FormTextarea from '@/components/ui/FormTextarea';
import PhoneInput from '@/components/ui/PhoneInput';
import DatePicker from '@/components/ui/DatePicker';
import GoldenButton from '@/components/ui/GoldenButton';
import { useFetchCountries } from '@/queries/use-core';
import { useSubmitContactForm } from '@/queries/use-contact';
import { preOrderSchema, type PreOrderFormData } from '@/validations/contact';
import { toast } from '@/components/ui/Toast';
import { CheckCircle2 } from 'lucide-react';

interface PreOrderModalProps {
    open: boolean;
    onClose: () => void;
}

type PreOrderFormErrors = Partial<Record<keyof PreOrderFormData, string>>;

export default function PreOrderModal({ open, onClose }: PreOrderModalProps) {
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const [formData, setFormData] = useState<PreOrderFormData>({
        name: '',
        phoneNumber: '',
        phoneCountryCode: '+91',
        email: '',
        targetDate: '',
        message: '',
    });
    const [errors, setErrors] = useState<PreOrderFormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { data: countriesData } = useFetchCountries({
        q: countrySearchQuery,
    });
    const countries = countriesData?.data || [];

    const submitMutation = useSubmitContactForm();

    const todayString = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend Zod validation
        const validation = preOrderSchema.safeParse(formData);
        if (!validation.success) {
            const fieldErrors: PreOrderFormErrors = {};
            validation.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof PreOrderFormData;
                if (fieldName) {
                    fieldErrors[fieldName] = issue.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            const payload: any = {
                name: formData.name.trim(),
                phone_number: formData.phoneNumber.trim(),
                phone_country_code: formData.phoneCountryCode || '+91',
                email: formData.email?.trim() || undefined,
                target_date: formData.targetDate || undefined,
                message: formData.message?.trim() || 'Pre-Order Request',
                enquiry_type: 'PRE_ORDER',
            };

            const res = await submitMutation.mutateAsync(payload);
            if (res.status_code === 6000 || res.status === 'success') {
                setIsSubmitted(true);
            } else {
                toast.error(res.message || 'Failed to submit pre-order inquiry.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            phoneNumber: '',
            phoneCountryCode: '+91',
            email: '',
            targetDate: '',
            message: '',
        });
        setErrors({});
        setCountrySearchQuery('');
        setIsSubmitted(false);
        onClose();
    };

    return (
        <ModalWrapper open={open} onClose={handleReset}>
            <div className="w-full max-w-[520px] bg-white rounded-[24px] overflow-visible shadow-2xl border border-[#E9EAEB]">
                {/* Header */}
                <div className="border-b border-[#E7E4DD] px-8 py-6">
                    <h2 className="text-2xl font-bold font-bricolage text-[#4E3325]">
                        Pre-Order Gift Boxes
                    </h2>
                    <p className="text-xs text-[#666666] mt-1 font-medium">
                        Reserve your boxes in advance. Share your details below and our team will get in touch.
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-14 h-14 bg-[#FAF4E6] border border-[#C4994A] rounded-full flex items-center justify-center mx-auto text-[#4E3325]">
                            <CheckCircle2 className="w-8 h-8 text-[#9A7236]" />
                        </div>
                        <h3 className="text-xl font-bold font-bricolage text-[#4E3325]">
                            Inquiry Received
                        </h3>
                        <p className="text-xs text-[#666666] max-w-xs mx-auto leading-relaxed font-medium">
                            Thank you! Our team will reach out shortly regarding your pre-order request.
                        </p>
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-[12px] h-[44px] px-8 text-xs bg-[#4E3325] text-white hover:bg-[#38241a] transition font-bold shadow-md"
                            >
                                Close Window
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Form Body */}
                        <div className="p-8 space-y-4">
                            <FormInput
                                label="Name"
                                required
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                                }}
                                error={errors.name}
                            />

                            <PhoneInput
                                label="Phone / WhatsApp"
                                required
                                value={formData.phoneNumber}
                                onChange={(val) => {
                                    setFormData((prev) => ({ ...prev, phoneNumber: val }));
                                    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                                }}
                                enableCodeSelect
                                codes={countries as any}
                                selectedCode={formData.phoneCountryCode}
                                onCodeChange={(code) =>
                                    setFormData((prev) => ({ ...prev, phoneCountryCode: code }))
                                }
                                enableCodeSearch
                                codeSearchPlaceholder="Search country code..."
                                onCodeSearchChange={setCountrySearchQuery}
                                placeholder="Enter phone number"
                                error={errors.phoneNumber}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormInput
                                    label="Email address"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, email: e.target.value }));
                                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                                    }}
                                    error={errors.email}
                                />

                                <DatePicker
                                    label="Target Date"
                                    placeholder="Select date"
                                    minDate={todayString}
                                    value={formData.targetDate}
                                    onChange={(dateVal) => {
                                        setFormData((prev) => ({ ...prev, targetDate: dateVal }));
                                        if (errors.targetDate) setErrors((prev) => ({ ...prev, targetDate: undefined }));
                                    }}
                                    error={errors.targetDate}
                                />
                            </div>

                            <FormTextarea
                                label="Message / Notes"
                                rows={3}
                                placeholder="Enter any special requests or notes..."
                                value={formData.message}
                                onChange={(e) => {
                                    setFormData((prev) => ({ ...prev, message: e.target.value }));
                                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                                }}
                                error={errors.message}
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-8 py-5 bg-white border-t border-[#E7E4DD]">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={submitMutation.isPending}
                                className="rounded-[12px] h-[44px] px-6 text-sm border border-[#D9D1C6] text-[#4E3325] hover:bg-black/5 outline-none transition font-semibold disabled:opacity-50 min-w-[100px]"
                            >
                                Cancel
                            </button>
                            <GoldenButton
                                type="submit"
                                isLoading={submitMutation.isPending}
                                className="min-w-[140px] h-[44px]"
                            >
                                Submit Inquiry
                            </GoldenButton>
                        </div>
                    </form>
                )}
            </div>
        </ModalWrapper>
    );
}
