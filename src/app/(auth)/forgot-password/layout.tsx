import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Forgot Password | Crizbe',
    description: 'Reset your Crizbe account password.',
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
