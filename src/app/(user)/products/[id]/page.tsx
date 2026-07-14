import { Metadata } from 'next';
import ProductDetailsClient from './ProductDetailsClient';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://api.crizbe.com/';

    try {
        const res = await fetch(`${baseUrl}products/products/${id}/`, {
            next: { revalidate: 60 }, // cache for 60 seconds
        });
        const responseData = await res.json();
        const product = responseData?.data;

        if (!product) {
            return {
                title: 'Product Not Found | Crizbe',
            };
        }

        const title = `${product.name} | Crizbe Premium Crunch Sticks`;
        const description =
            product.description ||
            `Savor the roasted perfection of Crizbe's premium ${product.name} crunch sticks. Crafted with real ingredients and dipped in rich Belgian chocolate.`;
        const ogImage =
            product.images?.[0]?.image || 'https://crizbe.com/images/user/og-image.jpeg';

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: 'website',
                url: `https://crizbe.com/products/${id}`,
                images: [
                    {
                        url: ogImage,
                        width: 800,
                        height: 800,
                        alt: product.name,
                    },
                ],
            },
        };
    } catch (error) {
        console.error('Error generating metadata for product:', error);
        return {
            title: 'Crizbe | Premium Crunch Sticks',
            description: 'Taste the luxury with Crizbe’s perfectly layered crunch sticks.',
        };
    }
}

export default async function Page() {
    return <ProductDetailsClient />;
}
