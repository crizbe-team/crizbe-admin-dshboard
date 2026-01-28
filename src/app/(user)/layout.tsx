import Image from 'next/image';

export default function HomedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        {children}
        <Image
            src="/images/user/crizbe-bg.png"
            alt="Crizbe"
            width={100}
            height={100}
            className="fixed w-full bottom-0 pointer-events-none z-0"
        />
    </>;
}
