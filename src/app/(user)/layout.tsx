import Header from '@/components/user/Header';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | Crizbe',
        default: 'Crizbe - Premium Products', // Set a default title
    },
    description: 'Shop the best premium products at Crizbe.',
};

export default function HomedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CurrencyProvider>
            <div>
                <Header />
                {children}
            </div>
        </CurrencyProvider>
    );
}
