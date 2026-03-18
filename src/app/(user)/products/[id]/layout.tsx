import type { Metadata } from 'next';
import { getProduct } from '@/services/products';

interface Props {
    params: any;
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        // Safe resolution to handle Next.js 14 (sync params) and Next.js 15 (async params)
        const resolvedParams = await Promise.resolve(params);
        const id = resolvedParams.id;
        const productId = Array.isArray(id) ? id[0] : id;

        if (!productId) return {};

        const result = await getProduct(productId, 'get');
        const product = result?.data;

        if (!product) return {};

        // const imageUrl = product.images?.[0] || product.icon || '';
        const title = product.name;
        const description = product.description || `Buy ${product.name} at Crizbe`;

        return {
            title: title,
            description: description,
            openGraph: {
                title: title,
                description: description,
                // images: imageUrl ? [{ url: imageUrl }] : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: title,
                description: description,
                // images: imageUrl ? [imageUrl] : [],
            },
        };
    } catch (error) {
        console.error('Error generating metadata for product:', error);
        return {};
    }
}

export default function ProductDetailsLayout({ children }: Props) {
    return <>{children}</>;
}
