import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Create a Crizbe account to start shopping and tracking your orders.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
