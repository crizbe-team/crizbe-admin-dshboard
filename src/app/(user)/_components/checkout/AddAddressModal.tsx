'use client';

import React, { useId, useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2, X } from 'lucide-react';

type SaveAs = 'Home' | 'Office' | 'Other';

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'UAE', 'Saudi Arabia', 'Singapore', 'Malaysia'];

const STATES = [
    'Kerala', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Andhra Pradesh', 'Telangana', 'Gujarat', 'Rajasthan',
    'West Bengal', 'Uttar Pradesh', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Delhi', 'Goa', 'Odisha', 'Assam',
];

export default function AddAddressModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [saveAs, setSaveAs] = useState<SaveAs>('Home');
    const [country, setCountry] = useState<string | null>(null);
    const [countryOpen, setCountryOpen] = useState(false);
    const countryRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<string | null>(null);
    const [stateOpen, setStateOpen] = useState(false);
    const stateRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const titleId = useId();

    const handleSave = () => {
        setIsSaving(true);
        // Replace with your save logic; then call onClose() when done
        setTimeout(() => {
            setIsSaving(false);
            onClose();
        }, 1500);
    };

    useEffect(() => {
        if (!countryOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
                setCountryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [countryOpen]);

    useEffect(() => {
        if (!stateOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
                setStateOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [stateOpen]);

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
                            Add address
                        </h2>
                        <p className="text-sm font-normal text-[#474747] mt-1">Enter the address details and continue.</p>
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
                        <Field label="First name*" placeholder="Enter your name" />
                        <Field label="Last name*" placeholder="Enter your name" />

                        <div>
                            <label className="text-xs text-[#404040] font-medium">Phone number*</label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-[#E7E4DD] bg-white px-3 py-2 hover:border-[#C4994A] focus-within:border-[#C4994A] transition-colors">
                                <span className="text-xs text-[#4E3325]">+91</span>
                                <input
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#B7AFA5]"
                                    placeholder="000 0000 000"
                                />
                            </div>
                        </div>

                        <Field label="Pincode*" placeholder="Enter pincode" />
                        <Field label="Address*" placeholder="Enter your address" />
                        <Field label="Street / Locality*" placeholder="Enter your street name or locality" />
                        <Field label="City*" placeholder="Enter your city" />
                        <Field label="Landmark (Optional)" placeholder="eg: opposite municipal office" />

                        <div ref={countryRef} className="relative">
                            <label className="text-xs font-medium text-[#404040]">Country*</label>
                            <button
                                type="button"
                                onClick={() => setCountryOpen((o) => !o)}
                                className="mt-1 w-full flex items-center justify-between rounded-lg border border-[#E7E4DD] bg-white px-3 py-2 text-sm text-left outline-none hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors"
                            >
                                <span className={country ? 'text-[#4E3325]' : 'text-[#B7AFA5]'}>
                                    {country ?? 'Select country'}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-[#6B635A] shrink-0 transition-transform ${countryOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {countryOpen && (
                                <div className="absolute z-10 mt-1 w-full rounded-lg border border-[#E7E4DD] bg-white shadow-lg py-1 max-h-[200px] overflow-auto">
                                    {COUNTRIES.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => {
                                                setCountry(c);
                                                setCountryOpen(false);
                                            }}
                                            className={`w-full px-3 py-2 text-left text-sm hover:bg-[#F5F3F0] transition-colors ${country === c ? 'bg-[#F5F3F0] text-[#4E3325] font-medium' : 'text-[#4E3325]'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div ref={stateRef} className="relative">
                            <label className="text-xs font-medium text-[#404040]">State*</label>
                            <button
                                type="button"
                                onClick={() => setStateOpen((o) => !o)}
                                className="mt-1 w-full flex items-center justify-between rounded-lg border border-[#E7E4DD] bg-white px-3 py-2 text-sm text-left outline-none hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors"
                            >
                                <span className={state ? 'text-[#4E3325]' : 'text-[#B7AFA5]'}>
                                    {state ?? 'Select your state'}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-[#6B635A] shrink-0 transition-transform ${stateOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {stateOpen && (
                                <div className="absolute z-10 mt-1 w-full rounded-lg border border-[#E7E4DD] bg-white shadow-lg py-1 max-h-[200px] overflow-auto">
                                    {STATES.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => {
                                                setState(s);
                                                setStateOpen(false);
                                            }}
                                            className={`w-full px-3 py-2 text-left text-sm hover:bg-[#F5F3F0] transition-colors ${state === s ? 'bg-[#F5F3F0] text-[#4E3325] font-medium' : 'text-[#4E3325]'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-xs text-[#474747] font-medium">Save address as:</span>
                            <div className="flex items-center gap-4 text-sm text-[#4E3325]">
                                {(['Home', 'Office', 'Other'] as SaveAs[]).map((v) => (
                                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="saveAs"
                                            checked={saveAs === v}
                                            onChange={() => setSaveAs(v)}
                                            className="focus-visible:ring-2 focus-visible:ring-[#C4994A] focus-visible:ring-offset-1 rounded-full outline-none"
                                        />
                                        <span className="text-xs">{v}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 z-10 mt-7 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-[24px] pt-[16px] pb-[20px] bg-white border-t border-[#E7E4DD]">
                    <label className="flex items-center gap-2 text-xs text-[#6B635A] cursor-pointe ">
                        <input type="checkbox" className="accent-[#C4994A] rounded-[6px] focus-visible:ring-2 focus-visible:ring-[#C4994A] focus-visible:ring-offset-1  outline-none" />
                        <span>Set as default shipping address</span>
                    </label>
                    <div className="flex flex-row  xs:flex-row justify-end gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-[12px] w-full  xs:w-auto px-6 py-2 text-sm border border-[#D9D1C6] text-[#4E3325] hover:bg-black/5 focus-visible:border-[#C4994A] outline-none transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded-[12px] w-full  xs:w-auto px-7 py-2 text-sm font-semibold text-white
                            bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)]
                            hover:opacity-95 active:opacity-90 focus-visible:ring-2 focus-visible:ring-[#C4994A] focus-visible:ring-offset-2 outline-none transition disabled:opacity-90 disabled:pointer-events-none inline-flex items-center justify-center gap-2 min-w-[80px]"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden />
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div >
    );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
    return (
        <div>
            <label className="text-xs font-medium text-[#404040]">{label}</label>
            <input
                className="mt-1 w-full rounded-lg border border-[#E7E4DD] bg-white px-3 py-2 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors"
                placeholder={placeholder}
            />
        </div>
    );
}

