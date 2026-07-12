import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Login | Crizbe Dashboard',
    description: 'Log in to Crizbe Admin Control Center to manage store items, stock, clients, and orders.',
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
