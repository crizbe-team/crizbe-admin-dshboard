import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Product Variants | Crizbe Admin',
    description: 'Configure and update product variant definitions.',
};

export default function VariantsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
