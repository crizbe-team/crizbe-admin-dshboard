'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Building2, CreditCard, Smartphone, Wallet, Loader2 } from 'lucide-react';
import Footer from '@/app/_components/Footer';
import CheckoutSteps from '@/app/(user)/_components/checkout/CheckoutSteps';
import { useRouter } from 'next/navigation';
import CartSummaryCard from '../_components/checkout/CartSummaryCard';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useFetchAddresses } from '@/queries/use-account';
import { useFetchCart } from '@/queries/use-cart';
import { useRazorpay } from '@/hooks/useRazorpay';
import { 
    useCreatePaymentOrder, 
    useVerifyPayment, 
    useRazorpayKeyId 
} from '@/queries/use-payment';
import { createOrder } from '@/services/orders';

type PayMethod = 'bank' | 'phonepe' | 'upi' | 'card' | 'cod' | 'razorpay';

export default function PaymentPage() {
    const router = useRouter();
    const { currency } = useCurrency();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selected, setSelected] = useState<PayMethod>('razorpay'); // Default to Razorpay
    
    // Fetch cart and addresses
    const { data: cartData } = useFetchCart();
    const { data: addressesData } = useFetchAddresses();
    
    // Payment hooks
    const { isLoaded: isRazorpayLoaded, openCheckout } = useRazorpay();
    const { data: keyIdData } = useRazorpayKeyId();
    const createPaymentOrderMutation = useCreatePaymentOrder();
    const verifyPaymentMutation = useVerifyPayment();
    
    // Find default or first address
    const defaultAddress = addressesData?.data?.find((addr: any) => addr.is_default) || 
                           addressesData?.data?.[0];

    const methods = useMemo(
        () => [
            {
                id: 'razorpay' as const,
                label: 'Razorpay',
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

    const handleRazorpayPayment = async () => {
        if (!defaultAddress) {
            alert('Please add an address first');
            return;
        }
        
        setIsProcessing(true);
        try {
            // Step 1: Create order
            const orderResponse = await createOrder({
                address_id: defaultAddress.id,
                payment_method: 'Razorpay',
                currency: currency || 'INR',
            });
            
            if (orderResponse.status_code !== 201) {
                throw new Error(orderResponse.message || 'Failed to create order');
            }
            
            const orderId = orderResponse.data.id;
            
            // Step 2: Create payment order
            const paymentOrderResponse = await createPaymentOrderMutation.mutateAsync(orderId);
            
            if (paymentOrderResponse.status_code !== 200) {
                throw new Error(paymentOrderResponse.message || 'Failed to create payment order');
            }
            
            const paymentData = paymentOrderResponse.data;
            
            // Step 3: Open Razorpay checkout
            const options = {
                key: paymentData.key_id,
                amount: paymentData.amount * 100, // Convert to paisa
                currency: paymentData.currency,
                name: "Crizbe",
                description: "Order Payment",
                order_id: paymentData.razorpay_order_id,
                prefill: { 
                    name: defaultAddress.first_name + ' ' + defaultAddress.last_name,
                    email: '', // Get from user profile if available
                    contact: defaultAddress.phone_number,
                },
                theme: { color: "#C4994A" },
                handler: async (razorpayResponse: any) => {
                    // Step 4: Verify payment
                    try {
                        const verifyResponse = await verifyPaymentMutation.mutateAsync({
                            razorpayOrderId: razorpayResponse.razorpay_order_id,
                            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                            razorpaySignature: razorpayResponse.razorpay_signature,
                        });
                        
                        if (verifyResponse.status_code === 200) {
                            // Step 5: Redirect to success page
                            router.push(`/order-success?orderId=${verifyResponse.data.order_id}`);
                        } else {
                            throw new Error(verifyResponse.message || 'Payment verification failed');
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
                    }
                }
            };
            
            openCheckout(options);
        } catch (error) {
            console.error('Razorpay payment failed:', error);
            alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCodPayment = async () => {
        if (!defaultAddress) {
            alert('Please add an address first');
            return;
        }
        
        setIsProcessing(true);
        try {
            // Create order with COD method
            const orderResponse = await createOrder({
                address_id: defaultAddress.id,
                payment_method: 'COD',
                currency: currency || 'INR',
            });

            if (orderResponse.status_code === 200) {
                // Redirect to success page
                router.push(`/order-success?orderId=${orderResponse.data.id}`);
            } else {
                throw new Error(orderResponse.message || 'Failed to create order');
            }
        } catch (error) {
            console.error('COD payment failed:', error);
            alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckout = async () => {
        if (selected === 'razorpay') {
            if (!isRazorpayLoaded) {
                alert('Razorpay is still loading. Please wait...');
                return;
            }
            await handleRazorpayPayment();
        } else if (selected === 'cod') {
            await handleCodPayment();
        } else {
            // Other payment methods remain as they were
            setIsProcessing(true);
            try {
                // Create order with selected currency
                await createOrder({
                    payment_method: selected,
                    currency: currency, // Pass selected currency to API
                    // Add other required order data here
                });

                // Redirect to success page or order confirmation
                router.push('/order-success');
            } catch (error) {
                console.error('Checkout failed:', error);
                // Handle error (show error message to user)
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <main className="min-h-screen bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
            <div className="wrapper mx-auto pt-[110px] pb-16">
                <CheckoutSteps active="Payment" />

                <div className="mt-3 flex items-start justify-between gap-10 flex-col lg:flex-row">
                    <section className="w-full flex-1">
                        <h1 className="text-2xl font-semibold text-[#4E3325]">
                            Choose payment method
                        </h1>

                        <div className="mt-6 rounded-2xl border border-[#E7E1D6] bg-white/70 backdrop-blur-sm overflow-hidden">
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
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#F6F0E6] grid place-items-center">
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
                            onContinue={handleCheckout}
                            isProcessing={isProcessing}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
