'use client';

import React, { useMemo, useState } from 'react';
import { Pencil, Phone, Trash2, Loader2 } from 'lucide-react';
import Footer from '@/app/_components/Footer';
import CheckoutSteps from '@/app/(user)/_components/checkout/CheckoutSteps';
import CartSummaryCard from '@/app/(user)/_components/checkout/CartSummaryCard';
import AddAddressModal from '@/app/(user)/_components/checkout/AddAddressModal';
import { useRouter } from 'next/navigation';
import {
    useFetchAddresses,
    useCreateAddress,
    useUpdateAddress,
    useDeleteAddress,
} from '@/queries/use-account';

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

export default function ShippingPage() {
    const router = useRouter();
    const { data: addressesData, isLoading } = useFetchAddresses();
    const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
    const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
    const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

    const addresses = addressesData?.data || [];

    const [selected, setSelected] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // Set default address as selected if available
    React.useEffect(() => {
        if (addresses.length > 0 && !selected) {
            const defaultAddress = addresses.find((addr: Address) => addr.is_default);
            setSelected(defaultAddress?.id || addresses[0].id);
        }
    }, [addresses, selected]);

    const handleDeleteAddress = (addressId: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            deleteAddress(addressId);
        }
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setOpen(true);
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setOpen(true);
    };

    const handleAddressSubmit = (addressData: any) => {
        if (editingAddress) {
            updateAddress(
                { id: editingAddress.id, data: addressData },
                {
                    onSuccess: () => {
                        setOpen(false);
                        setEditingAddress(null);
                    },
                }
            );
        } else {
            createAddress(addressData, {
                onSuccess: () => {
                    setOpen(false);
                    setEditingAddress(null);
                },
            });
        }
    };

    const formatAddress = (address: Address) => {
        const parts = [
            address.address_line1,
            address.street,
            address.city,
            address.state?.name,
            address.country?.name,
            address.zip_code,
        ].filter(Boolean);

        return parts.join(', ');
    };

    const getFullName = (address: Address) => {
        return `${address.first_name} ${address.last_name}`.trim();
    };

    const getPhone = (address: Address) => {
        return `${address.phone_country_code} ${address.phone_number}`;
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
                <div className="wrapper mx-auto pt-[110px] pb-16">
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <Loader2 className="w-10 h-10 animate-spin text-[#4E3325]" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
            <div className="wrapper mx-auto pt-[110px] pb-16">
                <CheckoutSteps active="Shipping" />
                <div className="flex justify-between py-[32px]">
                    <h1 className=" text-[22px] sm:text-[28px] font-medium text-[#191919]">
                        Shipping address
                    </h1>
                    <div className="flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="text-xs font-medium text-[#4E3325] hover:opacity-80 transition"
                        >
                            <span className="mr-2 text-sm">+</span> Add new address
                        </button>
                    </div>
                </div>
                <div className="flex items-start justify-between gap-10 flex-col lg:flex-row">
                    <section className="w-full flex-1">


                        <div className="">
                            {addresses.map((a: Address) => {
                                const active = a.id === selected;
                                return (
                                    <label
                                        key={a.id}
                                        className={[
                                            'block rounded-2xl border bg-white/70 backdrop-blur-sm p-[24px] cursor-pointer',
                                            active
                                                ? 'border-[#4E3325] shadow-sm'
                                                : 'border-[#E7E1D6]',
                                        ].join(' ')}
                                    >
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={active}
                                                onChange={() => setSelected(a.id)}
                                                className="mt-1 accent-[#4E3325]"
                                                disabled={isCreating || isUpdating || isDeleting}
                                            />

                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm font-medium text-[#191919]">
                                                        {getFullName(a)}
                                                        {a.is_default && (
                                                            <span className="ml-2 text-xs bg-[#4E3325] text-white px-2 py-1 rounded-full">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[12px] font-medium text-[#939393] border border-[#F5F3F0] bg-[#F5F3F0] py-1 px-[14px] rounded-full capitalize">
                                                        {a.address_type}
                                                    </span>
                                                </div>

                                                <div className="mt-2 mb-[10px] font-normal text-xs text-[#474747] leading-relaxed">
                                                    {formatAddress(a)}
                                                </div>
                                                {a.landmark && (
                                                    <div className="mt-1 mb-[10px] font-normal text-xs text-[#6B635A] italic">
                                                        Landmark: {a.landmark}
                                                    </div>
                                                )}
                                                <div className="mt-2 flex items-center gap-2 text-xs text-[#474747]">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span>{getPhone(a)}</span>
                                                </div>
                                                <hr className="border-t border-[#E7E4DD] my-4" />
                                                <div className="mt-4 flex items-center gap-6 text-xs text-[#6B635A]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteAddress(a.id)}
                                                        disabled={isDeleting}
                                                        className="flex text-[#404040] cursor-pointer items-center gap-2 hover:text-[#4E3325] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isDeleting ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                        <span>Delete</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditAddress(a)}
                                                        disabled={isUpdating}
                                                        className="flex text-[#404040] cursor-pointer items-center gap-2 hover:text-[#4E3325] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                        <span>Edit</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}

                            {addresses.length === 0 && (
                                <div className="text-center py-12 rounded-2xl border border-[#E7E1D6] bg-white/70 backdrop-blur-sm">
                                    <p className="text-[#474747] mb-4">No addresses found</p>
                                    <button
                                        onClick={handleAddAddress}
                                        className="text-sm font-medium text-[#4E3325] hover:opacity-80 transition"
                                    >
                                        Add your first address
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="w-full lg:w-auto">
                        <CartSummaryCard
                            itemsCount={2}
                            subTotal={849}
                            packing={50}
                            shippingLabel="Free"
                            discountLabel="--"
                            totalTax={24}
                            onContinue={() => {
                                if (!selected) {
                                    alert('Please select a shipping address');
                                    return;
                                }
                                router.push('/payment');
                            }}
                        />
                    </div>
                </div>
            </div>

            <Footer />

            <AddAddressModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditingAddress(null);
                }}
                onSubmit={handleAddressSubmit}
                editingAddress={editingAddress}
                isLoading={isCreating || isUpdating}
            />
        </main>
    );
}
