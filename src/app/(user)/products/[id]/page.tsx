import { Metadata } from 'next';
import ProductDetailsClient from './ProductDetailsClient';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const apiBaseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://api.crizbe.com/api/v1/').replace(/\/$/, '');
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crizbe.com').replace(/\/$/, '');

    try {
        const res = await fetch(`${apiBaseUrl}/products/products/${id}/`, {
            next: { revalidate: 60 }, // cache for 60 seconds
        });
        const responseData = await res.json();
        const product = responseData?.data;

        if (!product) {
            return {
                title: 'Product Not Found',
            };
        }

        const metaDetails = product.meta_details || {};
        const title =
            metaDetails.meta_title ||
            product.meta_title ||
            `${product.name} | Crizbe Chocolate`;

        const rawDesc =
            metaDetails.meta_description ||
            product.meta_description ||
            (product.description ? product.description.replace(/<[^>]*>?/gm, '') : '') ||
            `Savor the roasted perfection of Crizbe's premium ${product.name} crunch sticks.`;
        const description = rawDesc.replace(/\s+/g, ' ').slice(0, 200).trim();

        const rawKeywords = metaDetails.meta_keywords || product.meta_keywords;
        const keywords = rawKeywords
            ? typeof rawKeywords === 'string'
                ? rawKeywords.split(',').map((k: string) => k.trim()).filter(Boolean)
                : rawKeywords
            : [
                  product.name,
                  'Crizbe crunch sticks',
                  'Belgian chocolate snacks',
                  'premium chocolate',
                  'gourmet chocolate sticks',
              ];

        let rawImage = product.images?.[0]?.image || `${siteUrl}/images/user/og-image.jpeg`;
        let ogImage = rawImage;
        if (!ogImage.startsWith('http://') && !ogImage.startsWith('https://')) {
            const cleanPath = ogImage.startsWith('/') ? ogImage : `/${ogImage}`;
            ogImage = `${siteUrl}${cleanPath}`;
        }

        const mimeType = ogImage.endsWith('.webp')
            ? 'image/webp'
            : ogImage.endsWith('.png')
              ? 'image/png'
              : 'image/jpeg';

        const productUrl = `${siteUrl}/products/${id}`;

        return {
            title,
            description,
            keywords,
            alternates: {
                canonical: productUrl,
            },
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title,
                description,
                type: 'website',
                url: productUrl,
                siteName: 'Crizbe',
                images: [
                    {
                        url: ogImage,
                        secureUrl: ogImage,
                        type: mimeType,
                        width: 1200,
                        height: 630,
                        alt: product.name,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [ogImage],
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
