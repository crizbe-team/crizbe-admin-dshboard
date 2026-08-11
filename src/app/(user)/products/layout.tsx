import Footer from '@/app/_components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        absolute: 'Premium Chocolate Crunch Sticks Online India | Crizbe',
    },
    description:
        "Explore Crizbe's premium chocolate crunch sticks online in India, available in hazelnut, pistachio, almond and mixed flavours for every chocolate lover.",
    keywords: [
        'premium chocolate crunch sticks',
        'Belgian chocolate snacks',
        'hazelnut chocolate sticks',
        'pistachio chocolate snacks',
        'almond chocolate snacks',
        'gourmet chocolate collection',
    ],
    alternates: {
        canonical: 'https://crizbe.com/products',
    },
    openGraph: {
        title: 'Premium Chocolate Crunch Sticks Online India | Crizbe',
        description:
            "Explore Crizbe's premium chocolate crunch sticks online in India, available in hazelnut, pistachio, almond and mixed flavours for every chocolate lover.",
        url: 'https://crizbe.com/products',
        images: ['/images/user/og-image.jpeg'],
    },
};
const ProductsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="py-4 bg-[#fffcf5]">
            {children}
            <Footer />
        </div>
    );
};

export default ProductsLayout;
