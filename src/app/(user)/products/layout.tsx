import Footer from '@/app/_components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gourmet Chocolate Crunch Sticks Collection | Hazelnut, Pistachio & Almond | Crizbe',
    description:
        'Explore the full Crizbe luxury crunch sticks collection featuring Belgian chocolate with real Hazelnut, Pistachio, Almond nut fillings, and Mixed Packs.',
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
        title: 'Gourmet Chocolate Crunch Sticks Collection | Crizbe',
        description:
            'Indulge in Crizbe slender, perfectly layered Belgian chocolate crunch sticks in Hazelnut, Pistachio, and Almond flavors.',
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
