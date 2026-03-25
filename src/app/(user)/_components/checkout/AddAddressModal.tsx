'use client';

import React, { useId, useState, useEffect } from 'react';
import { useFetchCountries, useFetchStates } from '@/queries/use-core';
import FormSelect from '@/components/ui/FormSelect';
import FormInput from '@/components/ui/FormInput';
import PhoneInput from '@/components/ui/PhoneInput';
import GoldenButton from '@/components/ui/GoldenButton';
import { addressFormSchema, type AddressFormValues } from './addressSchema';
import { ModalWrapper } from '@/components/ui/ModalWrapper';

type SaveAs = 'home' | 'work' | 'other';

type Address = {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    phone_number: string;
    phone_country_code: string;
    zip_code: string;
    address_line1: string;
    street?: string;
    city: string;
    landmark?: string;
    country: string | { id: string; name: string }; // Can be either UUID string or object
    country_code?: string;
    country_name?: string;
    state: string | { id: string; name: string }; // Can be either UUID string or object
    state_name?: string;
    address_type: 'home' | 'work' | 'other';
    is_default: boolean;
    is_active?: boolean;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
    user?: string;
};

type AddressFormErrors = Partial<Record<keyof AddressFormValues, string>>;

const createEmptyForm = (): AddressFormValues => ({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    phoneCountryCode: '+91',
    zipCode: '',
    addressLine1: '',
    street: '',
    city: '',
    landmark: '',
    countryId: '',
    stateId: '',
    addressType: 'home',
    isDefault: false,
});

export default function AddAddressModal({
    open,
    onClose,
    onSubmit,
    editingAddress,
    isLoading,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void> | void;
    editingAddress: Address | null;
    isLoading: boolean;
}) {
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const [stateSearchQuery, setStateSearchQuery] = useState('');

    // Form state as a single object
    const [form, setForm] = useState<AddressFormValues>(createEmptyForm);
    const [errors, setErrors] = useState<AddressFormErrors>({});

    // Queries
    const { data: countriesData, isLoading: countriesLoading } = useFetchCountries({
        q: countrySearchQuery,
    });

    const { data: statesData, isLoading: statesLoading } = useFetchStates({
        country: form.countryId,
        q: stateSearchQuery,
    });

    // Flatten data
    const countries = countriesData?.data || [];
    const states = statesData?.data || [];

    const titleId = useId();

    // Initialize form with editing address data
    useEffect(() => {
        if (editingAddress) {
            // Extract country ID from either string or object format
            const countryId =
                typeof editingAddress.country === 'string'
                    ? editingAddress.country
                    : editingAddress.country?.id || '';

            // Extract state ID from either string or object format
            const stateId =
                typeof editingAddress.state === 'string'
                    ? editingAddress.state
                    : editingAddress.state?.id || '';

            setForm({
                firstName: editingAddress.first_name,
                lastName: editingAddress.last_name,
                phoneNumber: editingAddress.phone_number,
                phoneCountryCode: editingAddress.phone_country_code,
                zipCode: editingAddress.zip_code,
                addressLine1: editingAddress.address_line1,
                street: editingAddress.street || editingAddress.city || '', // fallback to city if street is empty
                city: editingAddress.city,
                landmark: editingAddress.landmark || '',
                countryId: countryId,
                stateId: stateId,
                addressType: editingAddress.address_type,
                isDefault: editingAddress.is_default,
            });
            setCountrySearchQuery('');
            setStateSearchQuery('');
            setErrors({});
        } else {
            setForm(createEmptyForm());
            setCountrySearchQuery('');
            setStateSearchQuery('');
            setErrors({});
        }
    }, [editingAddress, open]);

    const handleSave = async () => {
        const result = addressFormSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: AddressFormErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof AddressFormValues | undefined;
                if (field && !fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            }
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        const values = result.data;

        const addressData = {
            first_name: values.firstName,
            last_name: values.lastName,
            phone_number: values.phoneNumber,
            phone_country_code: values.phoneCountryCode,
            zip_code: values.zipCode,
            address_line1: values.addressLine1,
            street: values.street || undefined,
            city: values.city,
            landmark: values.landmark || undefined,
            country: values.countryId,
            state: values.stateId || '',
            address_type: values.addressType,
            is_default: values.isDefault,
        };

        try {
            await onSubmit(addressData);
        } catch (error) {
            // Optionally handle submission errors here
            console.error('Submission error:', error);
        } finally {
        }
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                style={{
                    willChange: 'transform, opacity', // Hardware acceleration hint
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative w-full md:w-[800px]  rounded-[24px] bg-white shadow-xl border border-[#EEE7DB] overflow-hidden flex flex-col"
            >

                <div className="sticky top-0 z-10 flex items-start justify-between px-[24px] pt-[24px] pb-[20px] bg-white">
                    <div>
                        <h2 id={titleId} className="text-base font-semibold text-[#191919]">
                            {editingAddress ? 'Edit address' : 'Add address'}
                        </h2>
                        <p className="text-sm font-normal text-[#474747] mt-1">Enter the address details and continue.</p>
                    </div>
                </div>
                <hr className="border-t border-[#E7E4DD]" />
                <div className="flex-1 min-h-0 px-[24px] pt-[30px] pb-[24px] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormInput
                            label="First name"
                            required
                            placeholder="Enter your name"
                            value={form.firstName}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, firstName: e.target.value }))
                            }
                            error={errors.firstName}
                        />
                        <FormInput
                            label="Last name"
                            required
                            placeholder="Enter your name"
                            value={form.lastName}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, lastName: e.target.value }))
                            }
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
                            placeholder="000 0000 000"
                            error={errors.phoneNumber}
                        />

                        <FormInput
                            label="Pincode"
                            required
                            placeholder="Enter pincode"
                            value={form.zipCode}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, zipCode: e.target.value }))
                            }
                            error={errors.zipCode}
                        />
                        <FormInput
                            label="Address"
                            required
                            placeholder="Enter your address"
                            value={form.addressLine1}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    addressLine1: e.target.value,
                                }))
                            }
                            error={errors.addressLine1}
                        />
                        <FormInput
                            label="Street / Locality"
                            required
                            placeholder="Enter your street name or locality"
                            value={form.street}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, street: e.target.value }))
                            }
                            error={errors.street}
                        />
                        <FormInput
                            label="City"
                            required
                            placeholder="Enter your city"
                            value={form.city}
                            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                            error={errors.city}
                        />
                        <FormInput
                            label="Landmark (Optional)"
                            placeholder="eg: opposite municipal office"
                            value={form.landmark ?? ''}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, landmark: e.target.value }))
                            }
                        />

                        <FormSelect
                            label="Country"
                            required
                            options={countries}
                            value={form.countryId}
                            onChange={(id) => {
                                setForm((prev) => ({ ...prev, countryId: id, stateId: '' }));
                                setStateSearchQuery('');
                            }}
                            enableSearch
                            searchPlaceholder="Search countries..."
                            onSearchChange={setCountrySearchQuery}
                            error={errors.countryId}
                        />

                        <FormSelect
                            label="State"
                            required
                            options={states}
                            value={form.stateId}
                            onChange={(id) => setForm((prev) => ({ ...prev, stateId: id }))}
                            enableSearch
                            searchPlaceholder="Search states..."
                            onSearchChange={setStateSearchQuery}
                            disabled={statesLoading}
                            error={errors.stateId}
                        />
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-xs text-[#474747] font-medium">
                                Save address as:
                            </span>
                            <div className="flex items-center gap-4 text-sm text-[#4E3325]">
                                {(['home', 'work', 'other'] as SaveAs[]).map((v) => (
                                    <label
                                        key={v}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="saveAs"
                                            checked={form.addressType === v}
                                            onChange={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    addressType: v,
                                                }))
                                            }
                                            className="focus-visible:ring-2 focus-visible:ring-[#C4994A] focus-visible:ring-offset-1 rounded-full outline-none"
                                        />
                                        <span className="text-xs capitalize">{v}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-none z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-[24px] pt-[16px] pb-[20px] bg-white border-t border-[#E7E4DD]">
                    <label className="flex items-center gap-2 text-xs text-[#6B635A] cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, isDefault: e.target.checked }))
                            }
                            className="accent-[#C4994A] rounded-[6px] focus-visible:ring-2 focus-visible:ring-[#C4994A] focus-visible:ring-offset-1 outline-none"
                        />
                        <span>Set as default shipping address</span>
                    </label>
                    <div className="flex flex-row xs:flex-row justify-end gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-[12px] w-full xs:w-auto px-6 py-2 text-sm border border-[#D9D1C6] text-[#4E3325] hover:bg-black/5 focus-visible:border-[#C4994A] outline-none transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <GoldenButton
                            type="button"
                            onClick={handleSave}
                            isLoading={isLoading}
                            disabled={countriesLoading || statesLoading}
                            className="w-full xs:w-auto"
                        >
                            Save
                        </GoldenButton>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
}
