import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Setup Password',
    description: 'Set up a new password for your Crizbe account.',
};

export default function SetupPasswordLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
