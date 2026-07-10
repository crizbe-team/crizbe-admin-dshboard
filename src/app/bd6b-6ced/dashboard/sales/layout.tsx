import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sales Reports & Analytics | Crizbe Admin',
    description: 'Analyze sales metrics, item performance, and revenues.',
};

export default function SalesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
