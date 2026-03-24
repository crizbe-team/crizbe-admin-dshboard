'use client';

import React, { useState } from 'react';
import { Pencil, Phone, Trash2, Loader2, Plus } from 'lucide-react';
import AddAddressModal from '@/app/(user)/_components/checkout/AddAddressModal';
import {
    useFetchAddresses,
    useCreateAddress,
    useUpdateAddress,
    useDeleteAddress,
} from '@/queries/use-account';
import ConfirmationModal from '@/components/Modals/ConfirmationModal';

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

export default function MyAddressesPage() {
    const { data: addressesData, isLoading } = useFetchAddresses();
    const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
    const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
    const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

    const addresses = addressesData?.data || [];

    const [selected, setSelected] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

    React.useEffect(() => {
        if (addresses.length > 0 && !selected) {
            const defaultAddress = addresses.find((addr: Address) => addr.is_default);
            setSelected(defaultAddress?.id || addresses[0].id);
        }
    }, [addresses, selected]);

    const handleDeleteAddress = (addressId: string) => {
        setAddressToDelete(addressId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (addressToDelete) {
            deleteAddress(addressToDelete, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setAddressToDelete(null);
                },
            });
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
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-[#4E3325]" />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-6 pl-1 pr-1">
                <h1 className="text-[22px] font-medium text-[#1A1A1A]">My Address</h1>
                <button
                    onClick={handleAddAddress}
                    className="flex items-center gap-1.5 text-[15px] text-[#007DDC] hover:text-[#005ea6] font-medium transition-colors"
                >
                    <Plus className="w-[18px] h-[18px] stroke-[2.5px]" />
                    <span>Add new address</span>
                </button>
            </div>

            <div className="grid gap-[22px]">
                {addresses.map((a: Address) => {
                    const active = a.id === selected;
                    return (
                        <div
                            key={a.id}
                            className={`rounded-[20px] border ${active ? 'border-[#4E3325]' : 'border-[#EEEEEE]'} bg-white p-[26px] shadow-sm transition-colors`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="pt-[2px]">
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={active}
                                        onChange={() => setSelected(a.id)}
                                        className="h-5 w-5 appearance-none rounded-full border border-gray-300 checked:border-[6px] checked:border-[#4E3325] bg-white transition-all outline-none cursor-pointer"
                                        disabled={isCreating || isUpdating || isDeleting}
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[17px] font-medium text-[#1A1A1A] flex items-center gap-2">
                                            {getFullName(a)}
                                            {a.is_default && (
                                                <span className="text-[11px] bg-[#EEEEEE] px-2 py-0.5 rounded-full text-[#555555] font-normal">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[13px] text-[#555555] bg-[#F4F4F4] py-1 px-3.5 rounded-full">
                                            {a.address_type === 'work'
                                                ? 'Office'
                                                : a.address_type === 'home'
                                                  ? 'Home'
                                                  : 'Other'}
                                        </span>
                                    </div>

                                    <div className="mt-2.5 max-w-[500px] text-[15px] text-[#555555] leading-[22px]">
                                        {formatAddress(a)}
                                    </div>
                                    {a.landmark && (
                                        <div className="mt-1 text-[14px] text-[#555555] italic">
                                            Landmark: {a.landmark}
                                        </div>
                                    )}
                                    <div className="mt-3 flex items-center gap-2 text-[15px] text-[#555555]">
                                        <Phone className="w-4 h-4 stroke-[2px]" />
                                        <span>{getPhone(a)}</span>
                                    </div>

                                    <hr className="border-t border-[#EEEEEE] mt-[22px] mb-[18px]" />

                                    <div className="flex items-center gap-6 text-[14px] text-[#555555]">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAddress(a.id)}
                                            disabled={isDeleting}
                                            className="flex items-center gap-1.5 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="w-[18px] h-[18px] animate-spin" />
                                            ) : (
                                                <Trash2 className="w-[18px] h-[18px] stroke-[2px]" />
                                            )}
                                            <span>Delete</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleEditAddress(a)}
                                            disabled={isUpdating}
                                            className="flex items-center gap-1.5 hover:text-[#007DDC] transition-colors disabled:opacity-50"
                                        >
                                            <Pencil className="w-[18px] h-[18px] stroke-[2px]" />
                                            <span>Edit</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {addresses.length === 0 && !isLoading && (
                    <div className="text-center py-[50px] rounded-[20px] border border-[#EEEEEE] bg-white text-[#555555]">
                        <p className="mb-4">No addresses found</p>
                        <button
                            onClick={handleAddAddress}
                            className="text-[15px] font-medium text-[#007DDC] hover:underline"
                        >
                            Add your first address
                        </button>
                    </div>
                )}
            </div>

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

            <ConfirmationModal
                open={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setAddressToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete address?"
                description="Are you sure you want to delete the selected address?"
                confirmText="Delete"
                isPending={isDeleting}
            />
        </div>
    );
}
