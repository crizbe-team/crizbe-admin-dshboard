'use client';

import React, { useMemo, useState } from 'react';
import { Pencil, Phone, Trash2 } from 'lucide-react';
import Footer from '@/app/_components/Footer';
import CheckoutSteps from '@/app/(user)/_components/checkout/CheckoutSteps';
import CartSummaryCard from '@/app/(user)/_components/checkout/CartSummaryCard';
import AddAddressModal from '@/app/(user)/_components/checkout/AddAddressModal';
import { useRouter } from 'next/navigation';

type Address = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export default function ShippingPage() {
  const router = useRouter();
  const addresses: Address[] = useMemo(
    () => [
      {
        id: 'a1',
        name: 'Aromal Sajeevan',
        address: 'Thalazh house thopippo PO Swam, Kattappana,\nIdukki Kerala - 685515',
        phone: '+91 9061132363',
        place: "Home"
      },
      {
        id: 'a2',
        name: 'Aromal Sajeevan',
        address: 'Pit Solutions, Yamuna building - Techno park phase\n03, Kazhakkoottam, Kerala - 685555',
        phone: '+91 9061132363',
        place: "Office"
      },
      {
        id: 'a3',
        name: 'Aromal Sajeevan',
        address: 'Thalazh house thopippo PO Swam, Kattappana,\nIdukki Kerala - 685515',
        phone: '+91 9061132363',
        place: "Other"
      },
    ],
    []
  );

  const [selected, setSelected] = useState<string>('a2');
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
      <div className="wrapper mx-auto pt-[110px] pb-16">
        <CheckoutSteps active="Shipping" />

        <div className="mt-3 flex items-start justify-between gap-10 flex-col lg:flex-row">
          <section className="w-full flex-1">
            <div className="flex items-center justify-between gap-4">
              <h1 className=" text-[22px] sm:text-[28px] font-medium text-[#191919]">Shipping address</h1>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-xs font-medium text-[#4E3325] hover:opacity-80 transition"
              >
                <span className="mr-2 text-sm">+</span> Add new address
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {addresses.map((a) => {
                const active = a.id === selected;
                return (
                  <label
                    key={a.id}
                    className={[
                      'block rounded-2xl border bg-white/70 backdrop-blur-sm p-[24px] cursor-pointer',
                      active ? 'border-[#4E3325] shadow-sm' : 'border-[#E7E1D6]',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="address"
                        checked={active}
                        onChange={() => setSelected(a.id)}
                        className="mt-1 accent-[#4E3325]"
                      />

                      <div className="flex-1">
                        <div className='flex justify-between items-center'>
                          <div className="text-sm font-medium text-[#191919]">{a.name}</div>
                          <span className='text-[12px] font-medium text-[#939393] boarder boarder-[#F5F3F0] bg-[#F5F3F0] py-1 px-[14px] rounded-full'>{a.place}</span>
                        </div>

                        <div className="mt-2 mb-[10px] font-normal text-xs text-[#474747] whitespace-pre-line leading-relaxed">
                          {a.address}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-[#474747]">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{a.phone}</span>
                        </div>
                        <hr className="border-t border-[#E7E4DD] my-4" />
                        <div className="mt-4 flex items-center gap-6 text-xs text-[#6B635A]">
                          <button
                            type="button"
                            className="flex text-[#404040] cursor-pointer items-center gap-2 hover:text-[#4E3325] transition"
                          >
                            <Trash2 className="w-4 h-4 " />
                            <span>Delete</span>
                          </button>
                          <button
                            type="button"
                            className="flex text-[#404040] cursor-pointer items-center gap-2 hover:text-[#4E3325] transition"
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
              onContinue={() => router.push('/payment')}
            />
          </div>
        </div>
      </div>

      <Footer />

      <AddAddressModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}

