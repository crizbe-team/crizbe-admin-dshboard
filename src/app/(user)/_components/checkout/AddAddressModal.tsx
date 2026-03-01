'use client';

import React, { useId, useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2, X } from 'lucide-react';
import { useFetchCountriesInfinite, useFetchStatesInfinite } from '@/queries/use-core';
import SearchableDropdown from '@/components/ui/SearchableDropdown';

type SaveAs = 'home' | 'work' | 'other';

type Address = {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    phone_country_code: string;
    zip_code: string;
    address_line1: string;
    street?: string;
    city: string;
    landmark?: string;
    country: {
        id: string;
        name: string;
    };
    state: {
        id: string;
        name: string;
    };
    address_type: 'home' | 'work' | 'other';
    is_default: boolean;
};

export default function AddAddressModal({
    open,
    onClose,
    onSubmit,
    editingAddress,
    isLoading,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    editingAddress: Address | null;
    isLoading: boolean;
}) {
    const [selectedCountryId, setSelectedCountryId] = useState<string>('');
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const [stateSearchQuery, setStateSearchQuery] = useState('');

    // Infinite scroll queries with search
    const {
        data: countriesData,
        isLoading: countriesLoading,
        hasNextPage: hasCountriesNextPage,
        fetchNextPage: fetchCountriesNextPage,
    } = useFetchCountriesInfinite({
        search: countrySearchQuery,
    });

    const {
        data: statesData,
        isLoading: statesLoading,
        hasNextPage: hasStatesNextPage,
        fetchNextPage: fetchStatesNextPage,
    } = useFetchStatesInfinite({
        country: selectedCountryId,
        search: stateSearchQuery,
    });

    // Flatten infinite query data
    const countries = countriesData?.pages.flatMap((page) => page.data) || [];
    const states = statesData?.pages.flatMap((page) => page.data) || [];

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
    const [zipCode, setZipCode] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [landmark, setLandmark] = useState('');
    const [addressType, setAddressType] = useState<SaveAs>('home');
    const [isDefault, setIsDefault] = useState(false);

    // Dropdown display state
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const titleId = useId();

    // Initialize form with editing address data
    useEffect(() => {
        if (editingAddress) {
            setFirstName(editingAddress.first_name);
            setLastName(editingAddress.last_name);
            setPhoneNumber(editingAddress.phone_number);
            setPhoneCountryCode(editingAddress.phone_country_code);
            setZipCode(editingAddress.zip_code);
            setAddressLine1(editingAddress.address_line1);
            setStreet(editingAddress.street || '');
            setCity(editingAddress.city);
            setLandmark(editingAddress.landmark || '');
            setAddressType(editingAddress.address_type);
            setIsDefault(editingAddress.is_default);
            setSelectedCountry(editingAddress.country?.name || '');
            setSelectedCountryId(editingAddress.country?.id || '');
            setSelectedState(editingAddress.state?.name || '');
        } else {
            // Reset form for new address
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            setPhoneCountryCode('+91');
            setZipCode('');
            setAddressLine1('');
            setStreet('');
            setCity('');
            setLandmark('');
            setAddressType('home');
            setIsDefault(false);
            setSelectedCountry('');
            setSelectedCountryId('');
            setSelectedState('');
        }
    }, [editingAddress, open]);

    const handleSave = () => {
        // Validate required fields
        if (
            !firstName ||
            !lastName ||
            !phoneNumber ||
            !zipCode ||
            !addressLine1 ||
            !city ||
            !selectedCountry ||
            !selectedState
        ) {
            alert('Please fill all required fields');
            return;
        }

        const addressData = {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            phone_country_code: phoneCountryCode,
            zip_code: zipCode,
            address_line1: addressLine1,
            street: street || undefined,
            city: city,
            landmark: landmark || undefined,
            country: selectedCountryId,
            state: states.find((s) => s.name === selectedState)?.id || '',
            address_type: addressType,
            is_default: isDefault,
        };

        onSubmit(addressData);
    };

    const handleCountrySelect = (country: any) => {
        setSelectedCountry(country.name);
        setSelectedCountryId(country.id);
        // Reset state when country changes
        setSelectedState('');
        setStateSearchQuery('');
    };

    const handleStateSelect = (state: any) => {
        setSelectedState(state.name);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-start sm:items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close overlay"
                onClick={onClose}
                className="absolute inset-0 bg-black/30"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative w-full max-w-[860px] rounded-[24px] bg-white shadow-xl border border-[#EEE7DB] max-h-[90vh] overflow-y-auto"
            >
                <div className="sticky top-0 z-10 flex items-start justify-between px-[24px] pt-[24px] pb-[20px] bg-white">
                    <div>
                        <h2 id={titleId} className="text-base font-semibold text-[#191919]">
                            {editingAddress ? 'Edit address' : 'Add address'}
                        </h2>
                        <p className="text-sm font-normal text-[#474747] mt-1">
                            Enter the address details and continue.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#C4994A] focus-visible:ring-offset-2 outline-none transition"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-[#A4A7AE]" />
                    </button>
                </div>
                <hr className="border-t border-[#E7E4DD]" />
                <div className="px-[24px] pt-[30px] pb-[24px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <Field
                            label="First name*"
                            placeholder="Enter your name"
                            value={firstName}
                            onChange={setFirstName}
                        />
                        <Field
                            label="Last name*"
                            placeholder="Enter your name"
                            value={lastName}
                            onChange={setLastName}
                        />

                        <div>
                            <label className="text-xs text-[#404040] font-medium">
                                Phone number*
                            </label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-[#E7E4DD] bg-white px-3 py-2 hover:border-[#C4994A] focus-within:border-[#C4994A] transition-colors">
                                <select
                                    value={phoneCountryCode}
                                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                                    className="text-xs text-[#4E3325] bg-transparent outline-none"
                                >
                                    <option value="+91">+91</option>
                                    <option value="+1">+1</option>
                                    <option value="+44">+44</option>
                                    <option value="+971">+971</option>
                                </select>
                                <input
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#B7AFA5]"
                                    placeholder="000 0000 000"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <Field
                            label="Pincode*"
                            placeholder="Enter pincode"
                            value={zipCode}
                            onChange={setZipCode}
                        />
                        <Field
                            label="Address*"
                            placeholder="Enter your address"
                            value={addressLine1}
                            onChange={setAddressLine1}
                        />
                        <Field
                            label="Street / Locality*"
                            placeholder="Enter your street name or locality"
                            value={street}
                            onChange={setStreet}
                        />
                        <Field
                            label="City*"
                            placeholder="Enter your city"
                            value={city}
                            onChange={setCity}
                        />
                        <Field
                            label="Landmark (Optional)"
                            placeholder="eg: opposite municipal office"
                            value={landmark}
                            onChange={setLandmark}
                        />

                        <SearchableDropdown
                            items={countries}
                            value={selectedCountry}
                            onChange={handleCountrySelect}
                            placeholder="Select country"
                            label="Country*"
                            disabled={countriesLoading}
                            isLoading={countriesLoading}
                            hasNextPage={hasCountriesNextPage}
                            fetchNextPage={fetchCountriesNextPage}
                            onSearch={setCountrySearchQuery}
                            searchPlaceholder="Search countries..."
                            required
                        />

                        <SearchableDropdown
                            items={states}
                            value={selectedState}
                            onChange={handleStateSelect}
                            placeholder="Select your state"
                            label="State*"
                            disabled={!selectedCountry || statesLoading}
                            isLoading={statesLoading}
                            hasNextPage={hasStatesNextPage}
                            fetchNextPage={fetchStatesNextPage}
                            onSearch={setStateSearchQuery}
                            searchPlaceholder="Search states..."
                            required
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
                                            checked={addressType === v}
                                            onChange={() => setAddressType(v)}
                                            className="focus-visible:ring-2 focus-visible:ring-[#C4994A] focus-visible:ring-offset-1 rounded-full outline-none"
                                        />
                                        <span className="text-xs capitalize">{v}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 z-10 mt-7 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-[24px] pt-[16px] pb-[20px] bg-white border-t border-[#E7E4DD]">
                    <label className="flex items-center gap-2 text-xs text-[#6B635A] cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
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
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isLoading || countriesLoading || statesLoading}
                            className="rounded-[12px] w-full xs:w-auto px-7 py-2 text-sm font-semibold text-white
                            bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)]
                            hover:opacity-95 active:opacity-90 focus-visible:ring-2 focus-visible:ring-[#C4994A] focus-visible:ring-offset-2 outline-none transition disabled:opacity-90 disabled:pointer-events-none inline-flex items-center justify-center gap-2 min-w-[80px]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden />
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    placeholder,
    value,
    onChange,
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="text-xs font-medium text-[#404040]">{label}</label>
            <input
                className="mt-1 w-full rounded-lg border border-[#E7E4DD] bg-white px-3 py-2 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
