'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

const FIELD_MAP: Record<string, keyof PreOrderFormData> = {
    name: 'name',
    phone_number: 'phoneNumber',
    phone_country_code: 'phoneCountryCode',
    email: 'email',
    target_date: 'targetDate',
    message: 'message',
};

export default function PreOrderModal({ open, onClose }: PreOrderModalProps) {
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { data: countriesData } = useFetchCountries({
        q: countrySearchQuery,
    });
    const countries = countriesData?.data || [];

    const submitMutation = useSubmitContactForm();
    const todayString = new Date().toISOString().split('T')[0];

    const {
        control,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PreOrderFormData>({
        resolver: zodResolver(preOrderSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            phoneNumber: '',
            phoneCountryCode: '+91',
            email: '',
            targetDate: '',
            message: '',
        },
    });

    const selectedCountryCode = watch('phoneCountryCode');

    useEffect(() => {
        if (open) {
            reset({
                name: '',
                phoneNumber: '',
                phoneCountryCode: '+91',
                email: '',
                targetDate: '',
                message: '',
            });
            setIsSubmitted(false);
            setCountrySearchQuery('');
        }
    }, [open, reset]);

    const handleApiErrors = (apiErrors: Record<string, any>, defaultMessage?: string) => {
        if (apiErrors && Object.keys(apiErrors).length > 0) {
            Object.keys(apiErrors).forEach((field) => {
                const formField = FIELD_MAP[field] || (field as keyof PreOrderFormData);
                const msg = Array.isArray(apiErrors[field]) ? apiErrors[field][0] : apiErrors[field];
                setError(formField as any, {
                    type: 'server',
                    message: msg,
                });
            });
        } else if (defaultMessage) {
            toast.error(defaultMessage);
        }
    };

    const onSubmit = async (data: PreOrderFormData) => {
        try {
            const payload: any = {
                name: data.name.trim(),
                phone_number: data.phoneNumber.trim(),
                phone_country_code: data.phoneCountryCode || '+91',
                email: data.email?.trim() || undefined,
                target_date: data.targetDate || undefined,
                message: data.message?.trim() || 'Pre-Order Request',
                enquiry_type: 'PRE_ORDER',
            };

            const res = await submitMutation.mutateAsync(payload);
            if (res.status_code === 6000 || res.status === 'success') {
                setIsSubmitted(true);
            } else if (res.errors && Object.keys(res.errors).length > 0) {
                handleApiErrors(res.errors, res.message);
            } else {
                toast.error(res.message || 'Failed to submit pre-order inquiry.');
            }
        } catch (error: any) {
            const apiErrors = error?.errors || error?.response?.data?.errors;
            if (apiErrors && Object.keys(apiErrors).length > 0) {
                handleApiErrors(apiErrors, error.message);
            } else {
                toast.error(error?.message || 'An error occurred. Please try again.');
            }
        }
    };

    const handleReset = () => {
        reset({
            name: '',
            phoneNumber: '',
            phoneCountryCode: '+91',
            email: '',
            targetDate: '',
            message: '',
        });
        setIsSubmitted(false);
        setCountrySearchQuery('');
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
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* Form Body */}
                        <div className="p-8 space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <FormInput
                                        label="Name"
                                        required
                                        placeholder="Enter your name"
                                        {...field}
                                        error={errors.name?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput
                                        label="Phone / WhatsApp"
                                        required
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        enableCodeSelect
                                        codes={countries as any}
                                        selectedCode={selectedCountryCode || '+91'}
                                        onCodeChange={(code) => setValue('phoneCountryCode', code)}
                                        enableCodeSearch
                                        codeSearchPlaceholder="Search country code..."
                                        onCodeSearchChange={setCountrySearchQuery}
                                        placeholder="Enter phone number"
                                        error={errors.phoneNumber?.message}
                                    />
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <FormInput
                                            label="Email address"
                                            type="email"
                                            placeholder="Enter email address"
                                            {...field}
                                            value={field.value || ''}
                                            error={errors.email?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="targetDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Target Date"
                                            placeholder="Select date"
                                            minDate={todayString}
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            error={errors.targetDate?.message}
                                        />
                                    )}
                                />
                            </div>

                            <Controller
                                name="message"
                                control={control}
                                render={({ field }) => (
                                    <FormTextarea
                                        label="Message / Notes"
                                        rows={3}
                                        placeholder="Enter any special requests or notes..."
                                        {...field}
                                        value={field.value || ''}
                                        error={errors.message?.message}
                                    />
                                )}
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-8 py-5 bg-[#FAF4E6]/50 border-t border-[#E7E4DD]">
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
