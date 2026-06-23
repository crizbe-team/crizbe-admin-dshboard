'use client';

import React, { useMemo, useState } from 'react';
import { CreditCard, Wallet, Smartphone, Landmark } from 'lucide-react';
import Footer from '@/app/_components/Footer';
import { useRouter } from 'next/navigation';
import CartSummaryCard from '../../_components/checkout/CartSummaryCard';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useFetchAddresses } from '@/queries/use-account';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useCreatePaymentOrder, useVerifyPayment } from '@/queries/use-payment';
import { createOrder } from '@/services/orders';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Cookies from 'js-cookie';
import { useFetchCartSummary } from '@/queries/use-cart';

type PayMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export default function PaymentPage() {
    const router = useRouter();
    const { currency } = useCurrency();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selected, setSelected] = useState<PayMethod>('upi'); // Default to UPI

    // Fetch cart and addresses
    const { data: addressesData, isLoading: isAddressesLoading } = useFetchAddresses();
    const { data: summaryResponse, isLoading: isSummaryLoading } = useFetchCartSummary();

    // Payment hooks
    const { isLoaded: isRazorpayLoaded, openCheckout } = useRazorpay();
    const createPaymentOrderMutation = useCreatePaymentOrder();
    const verifyPaymentMutation = useVerifyPayment();

    // Find the correct address ID (cookie first, then default address from cart summary)
    const targetAddressId = useMemo(() => {
        const cookieId = Cookies.get('selected_address_id');
        if (cookieId) return cookieId;

        const defaultId = summaryResponse?.data?.default_address;
        if (defaultId) return defaultId;

        return null;
    }, [summaryResponse]);

    // Find the selected address from addressesData
    const selectedAddress = useMemo(() => {
        if (!targetAddressId || !addressesData?.data) return null;
        return addressesData.data.find((addr: any) => addr.id === targetAddressId);
    }, [addressesData, targetAddressId]);

    const methods = useMemo(
        () => [
            {
                id: 'upi' as const,
                label: 'UPI (GPay, PhonePe, Paytm)',
                icon: Smartphone,
            },
            {
                id: 'card' as const,
                label: 'Card (Credit/Debit)',
                icon: CreditCard,
            },
            {
                id: 'netbanking' as const,
                label: 'Netbanking',
                icon: Landmark,
            },
            {
                id: 'wallet' as const,
                label: 'Wallet',
                icon: Wallet,
            },
        ],
        []
    );

    const handleRazorpayPayment = async (method: 'card' | 'upi' | 'netbanking' | 'wallet') => {
        console.log('handleRazorpayPayment called with method:', method);
        if (!selectedAddress) {
            console.log('Error: No selected address');
            alert('Please add an address first');
            return;
        }

        console.log('Setting isProcessing to true');
        setIsProcessing(true);
        try {
            console.log('Step 1: Creating order with address:', selectedAddress.id);
            const orderResponse = await createOrder({
                address_id: selectedAddress.id,
                payment_method: 'Razorpay',
                currency: currency || 'INR',
            });
            console.log('Step 1 response:', orderResponse);

            if (orderResponse.status_code !== 6000) {
                throw new Error(orderResponse.message || 'Failed to create order');
            }

            const orderId = orderResponse.data.id;
            console.log('Step 1 success. Order ID:', orderId);

            // Step 2: Create payment order
            console.log('Step 2: Creating payment order for order ID:', orderId);
            const paymentOrderResponse = await createPaymentOrderMutation.mutateAsync(orderId);
            console.log('Step 2 response:', paymentOrderResponse);

            if (paymentOrderResponse.status_code !== 6000) {
                throw new Error(paymentOrderResponse.message || 'Failed to create payment order');
            }

            const paymentData = paymentOrderResponse.data;
            console.log('Step 2 success. Payment Data:', paymentData);

            // Step 3: Open Razorpay checkout
            const options = {
                key: paymentData.key_id,
                amount: paymentData.amount * 100, // Convert to paisa
                currency: paymentData.currency,
                name: 'Crizbe',
                description: 'Order Payment',
                order_id: paymentData.razorpay_order_id,
                prefill: {
                    name: selectedAddress.first_name + ' ' + selectedAddress.last_name,
                    email: '', // Get from user profile if available
                    contact: selectedAddress.phone_number,
                    method: method,
                },
                theme: { color: '#C4994A' },
                handler: async (razorpayResponse: any) => {
                    // Step 4: Verify payment
                    try {
                        const verifyResponse = await verifyPaymentMutation.mutateAsync({
                            razorpayOrderId: razorpayResponse.razorpay_order_id,
                            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                            razorpaySignature: razorpayResponse.razorpay_signature,
                        });

                        if (verifyResponse.status_code === 6000) {
                            Cookies.remove('selected_address_id');
                            // Step 5: Redirect to success page
                            router.push(
                                `/profile/my-orders?orderId=${verifyResponse.data.order_id}`
                            );
                        } else {
                            throw new Error(
                                verifyResponse.message || 'Payment verification failed'
                            );
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: () => {
                        console.log('Payment cancelled by user');
                        setIsProcessing(false);
                    },
                },
            };

            openCheckout(options);
        } catch (error) {
            console.error('Razorpay payment failed:', error);
            alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckout = async () => {
        if (
            selected === 'upi' ||
            selected === 'card' ||
            selected === 'netbanking' ||
            selected === 'wallet'
        ) {
            if (!isRazorpayLoaded) {
                console.log('Razorpay not loaded yet');
                alert('Razorpay is still loading. Please wait...');
                return;
            }
            await handleRazorpayPayment(selected);
        } else {
            alert('Please select a payment method');
        }
    };

    return (
        <main className="min-h-screen bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
            <div className="wrapper mx-auto pt-[110px] pb-16">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-2xl font-semibold text-[#4E3325] py-[32px]">
                    Choose payment method
                </h1>

                <div className="mt-3 flex items-start justify-between gap-10 flex-col lg:flex-row">
                    <section className="w-full flex-1">
                        <div className="rounded-2xl border border-[#E7E1D6] bg-white/70 backdrop-blur-sm overflow-hidden">
                            {methods.map((m, idx) => {
                                const Icon = m.icon;
                                const active = selected === m.id;
                                return (
                                    <label
                                        key={m.id}
                                        className={[
                                            'flex items-center justify-between gap-4 px-5 py-4 cursor-pointer',
                                            idx !== methods.length - 1
                                                ? 'border-b border-[#EFE7DA]'
                                                : '',
                                            active ? 'bg-white/70' : '',
                                        ].join(' ')}
                                    >
                                        <div className="flex items-center gap-3 ">
                                            <div className="w-8 h-8 rounded-full bg-[#F6F0E6]  grid place-items-center">
                                                <Icon className="w-4 h-4 text-[#4E3325]" />
                                            </div>
                                            <span className="text-sm text-[#4E3325]">
                                                {m.label}
                                            </span>
                                        </div>

                                        <input
                                            type="radio"
                                            name="pay"
                                            checked={active}
                                            onChange={() => setSelected(m.id)}
                                            className="accent-[#4E3325] w-4 h-4"
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    <div className="w-full lg:w-auto">
                        <CartSummaryCard onContinue={handleCheckout} isProcessing={isProcessing} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

const breadcrumbItems = [
    {
        label: (
            <span className="font-[var(--font-inter-tight)] font-normal text-[#747474] text-[16px] leading-[140%] tracking-[0.01em] lining-nums proportional-nums">
                Home
            </span>
        ),
        href: '/',
    },
    {
        label: (
            <span className="font-[var(--font-inter-tight)] font-normal text-[#747474] text-[16px] leading-[140%] tracking-[0.01em] lining-nums proportional-nums">
                Checkout
            </span>
        ),
        href: '/checkout/cart',
    },
    {
        label: (
            <span className="font-[var(--font-inter-tight)] font-medium text-[#191919] text-[16px] leading-[140%] tracking-[0.01em] lining-nums proportional-nums">
                Payment
            </span>
        ),
    },
];
