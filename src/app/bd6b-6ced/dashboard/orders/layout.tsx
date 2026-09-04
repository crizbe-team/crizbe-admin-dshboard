import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Order Management',
    description: 'Track orders, modify status, and process deliveries.',
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
