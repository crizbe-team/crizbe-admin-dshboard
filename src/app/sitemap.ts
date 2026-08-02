import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crizbe.com';
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://api.crizbe.com/api/v1/';

    // Core static public routes
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
        changeFrequency: (route === '' || route === '/products' ? 'daily' : 'weekly') as
            | 'daily'
            | 'weekly',
        priority: route === '' ? 1.0 : route === '/products' ? 0.9 : 0.7,
    }));

    // Dynamic blog articles from API
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${apiUrl}blogs/`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            const posts = data.data || [];
            blogRoutes = posts.map((post: { slug: string; updated_at?: string }) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            }));
        }
    } catch {
        // Fallback static blog slugs if API is unreachable during static build
        const fallbackSlugs = [
            'art-of-belgian-chocolate-crunch-sticks',
            'hazelnut-pistachio-almond-gourmet-pairings',
            'luxury-snack-trends-elevating-dessert-experience',
        ];
        blogRoutes = fallbackSlugs.map((slug) => ({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));
    }

    return [...routes, ...blogRoutes];
}
