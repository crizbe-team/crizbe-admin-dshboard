import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Inventory & Stock Control | Crizbe Admin',
    description: 'Track and update product inventory levels.',
};

export default function StockLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
