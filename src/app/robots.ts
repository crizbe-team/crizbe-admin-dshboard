import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crizbe.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/bd6b-6ced/', '/profile/', '/checkout/', '/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
