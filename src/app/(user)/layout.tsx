import Header from '@/components/user/Header';
import Image from 'next/image';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

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
