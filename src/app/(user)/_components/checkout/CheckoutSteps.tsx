import React from 'react';

type Step = 'Cart' | 'Shipping' | 'Payment';

export default function CheckoutSteps({ active }: { active: Step }) {
    const steps: Step[] = ['Cart', 'Shipping', 'Payment'];

    return (
        <div className="text-xs text-[#7A736A] flex items-center gap-2">
            {steps.map((s, idx) => (
                <React.Fragment key={s}>
                    <span className={s === active ? 'text-[#4E3325] font-medium' : ''}>{s}</span>
                    {idx !== steps.length - 1 && <span className="text-[#C9C1B6]">/</span>}
                </React.Fragment>
            ))}
        </div>
    );
}

