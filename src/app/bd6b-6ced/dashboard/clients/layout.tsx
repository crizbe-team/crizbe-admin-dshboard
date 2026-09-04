import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Clients Directory',
    description: 'Manage customers and clients database details.',
};

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
