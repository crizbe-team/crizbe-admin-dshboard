'use client';

import React, { useId, useState } from 'react';
import { X } from 'lucide-react';

type SaveAs = 'Home' | 'Office' | 'Other';

export default function AddAddressModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [saveAs, setSaveAs] = useState<SaveAs>('Home');
    const titleId = useId();

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
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
                className="relative w-full max-w-[860px] rounded-2xl bg-white shadow-xl border border-[#EEE7DB]"
            >
                <div className="flex items-start justify-between px-8 pt-7 pb-4">
                    <div>
                        <h2 id={titleId} className="text-base font-semibold text-[#4E3325]">
                            Add address
                        </h2>
                        <p className="text-xs text-[#9A9288] mt-1">Enter the address details and continue.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-black/5 transition"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-[#6B635A]" />
                    </button>
                </div>

                <div className="px-8 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <Field label="First name*" placeholder="Enter your name" />
                        <Field label="Last name*" placeholder="Enter your name" />

                        <div>
                            <label className="text-xs text-[#6B635A]">Phone number*</label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-[#E7E1D6] bg-white px-3 py-2">
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

                        <div>
                            <label className="text-xs text-[#6B635A]">Country*</label>
                            <select className="mt-1 w-full rounded-lg border border-[#E7E1D6] bg-white px-3 py-2 text-sm text-[#4E3325] outline-none">
                                <option>Select country</option>
                                <option>India</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-[#6B635A]">State*</label>
                            <select className="mt-1 w-full rounded-lg border border-[#E7E1D6] bg-white px-3 py-2 text-sm text-[#4E3325] outline-none">
                                <option>Select your state</option>
                                <option>Kerala</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-[#6B635A]">Save address as:</span>
                            <div className="flex items-center gap-4 text-sm text-[#4E3325]">
                                {(['Home', 'Office', 'Other'] as SaveAs[]).map((v) => (
                                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="saveAs"
                                            checked={saveAs === v}
                                            onChange={() => setSaveAs(v)}
                                            className="accent-[#C4994A]"
                                        />
                                        <span className="text-xs">{v}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs text-[#6B635A] cursor-pointer">
                            <input type="checkbox" className="accent-[#C4994A]" />
                            <span>Set as default shipping address</span>
                        </label>
                    </div>

                    <div className="mt-7 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full px-6 py-2 text-sm border border-[#D9D1C6] text-[#4E3325] hover:bg-black/5 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full px-7 py-2 text-sm font-semibold text-white
              bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)]
              hover:opacity-95 active:opacity-90 transition"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
    return (
        <div>
            <label className="text-xs text-[#6B635A]">{label}</label>
            <input
                className="mt-1 w-full rounded-lg border border-[#E7E1D6] bg-white px-3 py-2 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5]"
                placeholder={placeholder}
            />
        </div>
    );
}

