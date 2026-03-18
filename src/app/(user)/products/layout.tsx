import Footer from '@/app/_components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Products',
    description: 'Browse our full collection of premium products at Crizbe.',
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
