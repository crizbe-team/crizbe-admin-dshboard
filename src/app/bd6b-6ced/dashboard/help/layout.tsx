import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Help & Support | Crizbe Admin',
    description: 'Admin help and support documentation.',
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
