import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crizbe.com';
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://api.crizbe.com/api/v1/';

    // Core static public routes
    const staticRoutes: MetadataRoute.Sitemap = [
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

    // Dynamic Product pages from API
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${apiUrl}products/products/`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            const products = data.data || [];
            productRoutes = products
                .filter((p: any) => p.slug)
                .map((product: { slug: string; updated_at?: string }) => ({
                    url: `${baseUrl}/products/${product.slug}`,
                    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
                    changeFrequency: 'daily' as const,
                    priority: 0.8,
                }));
        }
    } catch (error) {
        console.error('Sitemap product fetch error:', error);
    }

    // Dynamic Blog articles from API
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${apiUrl}blogs/`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            const posts = data.data || [];
            blogRoutes = posts
                .filter((p: any) => p.slug)
                .map((post: { slug: string; updated_at?: string }) => ({
                    url: `${baseUrl}/blog/${post.slug}`,
                    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }));
        }
    } catch (error) {
        console.error('Sitemap blog fetch error:', error);
    }

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
