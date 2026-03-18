import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Log in to your Crizbe account to manage your orders and profile.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
