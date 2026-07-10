import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Customer Enquiries | Crizbe Admin',
    description: 'Review and reply to customer support enquiries.',
};

export default function EnquiriesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
