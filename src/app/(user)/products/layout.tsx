import Footer from "@/app/_components/Footer";

const ProductsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="py-4 bg-[#fffcf5]">
            {children}
            <Footer />
        </div>
    );
};

export default ProductsLayout;