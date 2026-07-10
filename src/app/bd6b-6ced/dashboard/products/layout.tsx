import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Product Management | Crizbe Admin',
    description: 'Add, update, or remove Crizbe products.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
