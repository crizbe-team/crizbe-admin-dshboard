import Header from '@/components/user/Header';
import Image from 'next/image';

export default function HomedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div>
        <Header />
        {children}
    </div>;
}
