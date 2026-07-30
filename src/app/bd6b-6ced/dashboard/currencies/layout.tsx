import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings | Crizbe Admin',
    description: 'Configure and update system settings.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
