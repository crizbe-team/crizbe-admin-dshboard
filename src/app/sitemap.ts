import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crizbe.com';

    // Static pages
    const routes = [
        '',
        '/products',
        '/our-story',
        '/contact-us',
        '/privacy-policy',
        '/terms-and-conditions',
        '/blog',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: (route === '' || route === '/products' ? 'daily' : 'weekly') as 'daily' | 'weekly',
        priority: route === '' ? 1.0 : route === '/products' ? 0.9 : 0.7,
    }));

    // Static blog posts
    const blogSlugs = [
        'art-of-belgian-chocolate-crunch-sticks',
        'hazelnut-pistachio-almond-gourmet-pairings',
        'luxury-snack-trends-elevating-dessert-experience',
    ];

    const blogRoutes = blogSlugs.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [...routes, ...blogRoutes];
}
