import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Verify OTP',
    description: 'Verify your account with the OTP sent to your email or mobile.',
};

export default function EnterOtpLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
