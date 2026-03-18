import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipping Details',
    description: 'Enter your shipping information for your Crizbe order.',
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
