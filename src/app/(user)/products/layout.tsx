import Footer from '@/app/_components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Premium Crunch Sticks Collection | Crizbe',
    description: 'Explore the full Crizbe crunch sticks collection: Hazelnut, Pista, and Almond. Indulge in chocolate-covered luxury.',
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
