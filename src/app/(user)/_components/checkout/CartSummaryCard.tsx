import React from 'react';

const money = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function CartSummaryCard({
    itemsCount,
    subTotal,
    packing,
    shippingLabel,
    discountLabel,
    totalTax,
    onContinue,
}: {
    itemsCount: number;
    subTotal: number;
    packing: number;
    shippingLabel: string;
    discountLabel: string;
    totalTax: number;
    onContinue?: () => void;
}) {
    const total = subTotal + packing + totalTax;

    return (
        <aside >
            <div className="w-full lg:w-[380px] rounded-2xl border px-6 py-6  border-[#E7E1D6] bg-white/70 backdrop-blur-sm">
                <div className=" flex items-center justify-between">
                    <h3 className="text-[20px] font-medium text-[#191919]">Cart Summary</h3>
                    <span className="text-[16px] text-[#9A9288]">{itemsCount} items</span>
                </div>
                <hr className="border-t border-[#E7E4DD] my-4" />
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-[#474747]">
                        <span>Sub Total</span>
                        <span className="text-[#212121]">{money(subTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#474747]">
                        <span>Packing</span>
                        <span className="text-[#212121]">{money(packing)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#474747]">
                        <span>Shipping</span>
                        <span className="text-[#212121]">{shippingLabel}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#474747]">
                        <span>Discount</span>
                        <span className="text-[#212121]">{discountLabel}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#474747]">
                        <span>Total Tax</span>
                        <span className="text-[#212121]">{money(totalTax)}</span>
                    </div>
                    <hr className="border-t border-[#E7E4DD] my-4" />
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#212121]">Total Amount</span>
                        <span className="text-sm font-semibold text-[#212121]">{money(total)}</span>
                    </div>


                </div>
            </div>
            <button
                type="button"
                onClick={onContinue}
                className="mt-[16px] w-full rounded-[12px] py-3 text-sm font-medium text-white cursor-pointer
          bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)]
          shadow-sm hover:opacity-95 active:opacity-90 transition text-[14px]"
            >
                Continue
            </button>
        </aside>
    );
}

