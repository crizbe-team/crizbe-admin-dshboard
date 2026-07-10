import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Messages | Crizbe Admin',
    description: 'Manage admin portal messages.',
};

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
