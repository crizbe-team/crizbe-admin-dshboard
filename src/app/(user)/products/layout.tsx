import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop Premium Chocolate Crunch Sticks',
    description:
        "Explore Crizbe's premium chocolate crunch sticks online in India, available in hazelnut, pistachio, almond and mixed flavours for every chocolate lover.",
    alternates: {
        canonical: 'https://www.crizbe.com/products',
    },
    openGraph: {
        title: 'Premium Chocolate Crunch Sticks Online India | Crizbe',
        description:
            "Explore Crizbe's premium chocolate crunch sticks online in India, available in hazelnut, pistachio, almond and mixed flavours for every chocolate lover.",
        url: 'https://www.crizbe.com/products',
    },
    twitter: {
        title: 'Premium Chocolate Crunch Sticks Online India | Crizbe',
        description:
            "Explore Crizbe's premium chocolate crunch sticks online in India, available in hazelnut, pistachio, almond and mixed flavours for every chocolate lover.",
    },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
