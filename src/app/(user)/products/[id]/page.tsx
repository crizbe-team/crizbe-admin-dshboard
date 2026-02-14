'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchSingleProduct, useFetchProducts } from '@/queries/use-products';
import Loader from '@/components/ui/loader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGallery from '@/app/_components/ui/ProductGallery';
import ProductInfo from '@/app/_components/ui/ProductInfo';
import AccordionItem from '@/components/ui/Accordion';
import ProductCard from '@/app/_components/ui/ProductCard';
import { ArrowLeft } from 'lucide-react';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const productId = Array.isArray(id) ? id[0] : id;

    const { data: productData, isLoading, isError } = useFetchSingleProduct(productId || '');
    const { data: relatedProductsData } = useFetchProducts({ limit: 4 }); // Mock limit, adjust if API supports
    console.log(productData, "productData");
    const product = productData;
    const relatedProducts = relatedProductsData?.data?.slice(0, 4) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader />
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 mx-auto text-purple-600 hover:text-purple-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: product.name },
    ];

    return (
        <div className="wrapper py-8 md:py-12 mt-20">
            <Breadcrumb items={breadcrumbItems} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                {/* Left Column: Gallery */}
                <div>
                    <ProductGallery
                        images={product.images || []}
                        productName={product.name}
                        productIcon={product.icon}
                    />
                </div>
                <div>
                    <ProductInfo product={product} />

                    <div className="space-y-4">
                        <AccordionItem title="About the product" defaultOpen={true}>
                            <p className="text-sm">
                                {product.description ||
                                    'Experience the premium quality of Crizbe products. Crafted with care and the finest ingredients.'}
                            </p>
                            {product.ingredients && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-xs uppercase mb-2">Ingredients</h4>
                                    <p className="text-sm">{product.ingredients}</p>
                                </div>
                            )}
                        </AccordionItem>
                        <AccordionItem title="Ratings & Reviews">
                            <div className="text-sm">
                                <p>No reviews yet.</p>
                            </div>
                        </AccordionItem>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-20">
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8 font-serif">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p: any) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsPage;