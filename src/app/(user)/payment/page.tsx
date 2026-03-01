'use client';

import React, { useMemo, useState } from 'react';
import { Building2, CreditCard, Smartphone, Wallet } from 'lucide-react';
import Footer from '@/app/_components/Footer';
import CheckoutSteps from '@/app/(user)/_components/checkout/CheckoutSteps';
import { useRouter } from 'next/navigation';
import CartSummaryCard from '../_components/checkout/CartSummaryCard';

type PayMethod = 'bank' | 'phonepe' | 'upi' | 'card' | 'cod';

export default function PaymentPage() {
    const router = useRouter();
    const methods = useMemo(
        () => [
            {
                id: 'bank' as const,
                label: 'ICICI Bank XX 6524',
                icon: Building2,
            },
            {
                id: 'phonepe' as const,
                label: 'Phonepe UPI 12356@az',
                icon: Smartphone,
            },
            {
                id: 'upi' as const,
                label: 'UPI',
                icon: Wallet,
            },
            {
                id: 'card' as const,
                label: 'Add Debit/Credit Card',
                icon: CreditCard,
            },
            {
                id: 'cod' as const,
                label: 'Cash on Delivery',
                icon: Wallet,
            },
        ],
        []
    );

    const [selected, setSelected] = useState<PayMethod>('bank');

    return (
        <main className="min-h-screen bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
            <div className="wrapper mx-auto pt-[110px] pb-16">
                <CheckoutSteps active="Payment" />

                <div className="mt-3 flex items-start justify-between gap-10 flex-col lg:flex-row">
                    <section className="w-full flex-1">
                        <h1 className="text-2xl font-semibold text-[#4E3325]">Choose payment method</h1>

                        <div className="mt-6 rounded-2xl border border-[#E7E1D6] bg-white/70 backdrop-blur-sm overflow-hidden">
                            {methods.map((m, idx) => {
                                const Icon = m.icon;
                                const active = selected === m.id;
                                return (
                                    <label
                                        key={m.id}
                                        className={[
                                            'flex items-center justify-between gap-4 px-5 py-4 cursor-pointer',
                                            idx !== methods.length - 1 ? 'border-b border-[#EFE7DA]' : '',
                                            active ? 'bg-white/70' : '',
                                        ].join(' ')}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#F6F0E6] grid place-items-center">
                                                <Icon className="w-4 h-4 text-[#4E3325]" />
                                            </div>
                                            <span className="text-sm text-[#4E3325]">{m.label}</span>
                                        </div>

                                        <input
                                            type="radio"
                                            name="pay"
                                            checked={active}
                                            onChange={() => setSelected(m.id)}
                                            className="accent-[#C4994A]"
                                        />
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
                            onContinue={() => router.push('/')}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
