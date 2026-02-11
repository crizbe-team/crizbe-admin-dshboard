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
        <Image
            src="/images/user/crizbe-bg.png"
            alt="Crizbe"
            width={100}
            height={100}
            sizes="100vw"
            className="fixed w-full bottom-0 pointer-events-none z-5 "
        />
    </div>;
}
