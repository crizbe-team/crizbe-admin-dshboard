export default function HomedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="w-[90%] mx-auto max-w-[1440px]">{children}</div>;
}
