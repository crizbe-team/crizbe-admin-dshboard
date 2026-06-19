'use client';

import React, { useState, useEffect } from 'react';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import FormInput from '@/components/ui/FormInput';
import PhoneInput from '@/components/ui/PhoneInput';
import GoldenButton from '@/components/ui/GoldenButton';
import { useFetchCountries } from '@/queries/use-core';
import { profileSchema, type ProfileFormData } from '@/validations/profile';

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    initialData?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
        phone_country_code?: string;
    };
    onSubmit: (data: any) => Promise<void> | void;
    isLoading: boolean;
}

type ProfileFormErrors = Partial<Record<keyof ProfileFormData, string>>;

export default function EditProfileModal({
    open,
    onClose,
    initialData,
    onSubmit,
    isLoading,
}: EditProfileModalProps) {
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const [form, setForm] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        phoneCountryCode: '+91',
    });
    const [errors, setErrors] = useState<ProfileFormErrors>({});

    const { data: countriesData } = useFetchCountries({
        q: countrySearchQuery,
    });
    const countries = countriesData?.data || [];

    useEffect(() => {
        if (open && initialData) {
            setForm({
                firstName: initialData.first_name || '',
                lastName: initialData.last_name || '',
                email: initialData.email || '',
                phoneNumber: initialData.phone_number || '',
                phoneCountryCode: initialData.phone_country_code || '+91',
            });
            setErrors({});
            setCountrySearchQuery('');
        }
    }, [open, initialData]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = profileSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: ProfileFormErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof ProfileFormData | undefined;
                if (field && !fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            }
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        const values = result.data;

        const payload = {
            first_name: values.firstName,
            last_name: values.lastName,
            phone_number: values.phoneNumber,
            phone_country_code: values.phoneCountryCode,
        };

        try {
            await onSubmit(payload);
        } catch (error) {
            console.error('Profile update submission error:', error);
        }
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <form
                onSubmit={handleSave}
                style={{
                    willChange: 'transform, opacity',
                }}
                className="relative w-[550px] max-w-[550px] bg-white rounded-lg shadow-2xl flex flex-col border border-[#EEE7DB]"
            >
                {/* Header */}
                <div className="flex items-start justify-between px-8 pt-8 pb-5 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-[#191919]">Edit profile</h2>
                        <p className="text-sm font-normal text-[#474747] mt-1">
                            Update your profile details
                        </p>
                    </div>
                </div>

                <hr className="border-t border-[#E7E4DD] mx-8" />

                {/* Content */}
                <div className="flex-1 px-8 py-6 space-y-5">
                    <FormInput
                        label="First name"
                        required
                        placeholder="Enter first name"
                        value={form.firstName}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, firstName: e.target.value }))
                        }
                        error={errors.firstName}
                    />

                    <FormInput
                        label="Last name"
                        required
                        placeholder="Enter last name"
                        value={form.lastName}
                        onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                        error={errors.lastName}
                    />

                    <PhoneInput
                        label="Phone number"
                        required
                        value={form.phoneNumber}
                        onChange={(val) => setForm((prev) => ({ ...prev, phoneNumber: val }))}
                        enableCodeSelect
                        codes={countries as any}
                        selectedCode={form.phoneCountryCode}
                        onCodeChange={(code) =>
                            setForm((prev) => ({ ...prev, phoneCountryCode: code }))
                        }
                        enableCodeSearch
                        codeSearchPlaceholder="Search country code..."
                        onCodeSearchChange={setCountrySearchQuery}
                        placeholder="Enter phone number"
                        error={errors.phoneNumber}
                    />

                    <FormInput
                        label="Email id"
                        disabled
                        required
                        type="email"
                        placeholder="Enter email address"
                        value={form.email}
                        className="bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed hover:border-gray-200 focus-visible:border-gray-200"
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        error={errors.email}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-8 py-6 bg-white border-t border-[#E7E4DD]">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-[12px] h-[48px] px-6 py-2 text-sm border border-[#D9D1C6] text-[#4E3325] hover:bg-black/5 focus-visible:border-[#C4994A] outline-none transition font-semibold disabled:opacity-50 min-w-[110px]"
                    >
                        Cancel
                    </button>
                    <GoldenButton type="submit" isLoading={isLoading} className="min-w-[110px]">
                        Update
                    </GoldenButton>
                </div>
            </form>
        </ModalWrapper>
    );
}
