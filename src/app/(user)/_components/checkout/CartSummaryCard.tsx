import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Loader2 } from 'lucide-react';
import { useFetchCartSummary } from '@/queries/use-cart';

export default function CartSummaryCard({
    onContinue,
    isProcessing = false,
}: {
    onContinue?: () => void;
    isProcessing?: boolean;
}) {
    const { convertPrice, isLoading: isCurrencyLoading } = useCurrency();
    const { data: summaryResponse, isLoading: isSummaryLoading } = useFetchCartSummary();

    const formatMoney = (n: number) => {
        return isCurrencyLoading ? 'Loading...' : convertPrice(n);
    };

    if (isSummaryLoading) {
        return (
            <aside>
                <div className="w-full lg:w-[380px] rounded-2xl border px-6 py-6 border-[#E7E1D6] bg-white/70 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[20px] font-medium text-[#191919]">Cart Summary</h3>
                        <div className="h-5 w-16 bg-[#E7E1D6]/50 animate-pulse rounded" />
                    </div>
                    <hr className="border-t border-[#E7E4DD] my-4" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="h-4 w-20 bg-[#E7E1D6]/50 animate-pulse rounded" />
                                <div className="h-4 w-16 bg-[#E7E1D6]/50 animate-pulse rounded" />
                            </div>
                        ))}
                        <hr className="border-t border-[#E7E4DD] my-4" />
                        <div className="flex items-center justify-between">
                            <div className="h-5 w-24 bg-[#E7E1D6]/50 animate-pulse rounded" />
                            <div className="h-5 w-20 bg-[#E7E1D6]/50 animate-pulse rounded" />
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    disabled
                    className="mt-[16px] w-full rounded-[12px] py-3 text-sm font-medium text-white cursor-not-allowed
              bg-[#C4994A]/60 transition text-[14px] flex items-center justify-center"
                >
                    <Loader2 className="w-5 h-5 animate-spin" />
                </button>
            </aside>
        );
    }

    const summaryData = summaryResponse?.data || {};
    const itemsCount = summaryData.items_count || 0;
    const subTotal = summaryData.subtotal || 0;
    const packing = summaryData.packing_fee || 0;
    const shipping = summaryData.shipping_fee || 0;
    const totalTax = summaryData.total_tax || 0;
    const discount = summaryData.discount || 0;
    const total = summaryData.total_amount || 0;

    return (
        <aside>
            <div className="w-full lg:w-[380px] rounded-2xl border px-6 py-6 border-[#E7E1D6] bg-white/70 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-medium text-[#191919]">Cart Summary</h3>
                    <span className="text-[16px] text-[#9A9288]">{itemsCount} items</span>
                </div>
                <hr className="border-t border-[#E7E4DD] my-4" />
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-[#474747]">
                        <span>Sub Total</span>
                        <span className="text-[#212121]">{formatMoney(subTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#474747]">
                        <span>Packing</span>
                        <span className="text-[#212121]">
                            {packing === 0 ? 'Free' : formatMoney(packing)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[#474747]">
                        <span>Shipping</span>
                        <span className="text-[#212121]">
                            {shipping === 0 ? 'Free' : formatMoney(shipping)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[#474747]">
                        <span>Total Tax</span>
                        <span className="text-[#212121]">{formatMoney(totalTax)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex items-center justify-between text-green-700">
                            <span>Discount</span>
                            <span className="font-medium">-{formatMoney(discount)}</span>
                        </div>
                    )}
                    <hr className="border-t border-[#E7E4DD] my-4" />
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#212121]">Total Amount</span>
                        <span className="text-sm font-semibold text-[#212121]">
                            {formatMoney(total)}
                        </span>
                    </div>
                </div>
            </div>
            <button
                type="button"
                onClick={onContinue}
                disabled={isProcessing}
                className="mt-[16px] w-full rounded-[12px] py-3 text-sm font-medium text-white cursor-pointer
          bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)]
          shadow-sm hover:opacity-95 active:opacity-90 transition text-[14px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </>
                ) : (
                    'Continue'
                )}
            </button>
        </aside>
    );
}
