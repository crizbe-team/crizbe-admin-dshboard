import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const apiBaseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://api.crizbe.com/api/v1/').replace(/\/$/, '');
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crizbe.com').replace(/\/$/, '');

    const canonicalUrl = `${siteUrl}/blog/${slug}`;

    try {
        const res = await fetch(`${apiBaseUrl}/blogs/${slug}/`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return {
                title: 'Article | Crizbe Blog',
                alternates: {
                    canonical: canonicalUrl,
                },
            };
        }

        const responseData = await res.json();
        const post = responseData?.data;

        if (!post) {
            return {
                title: 'Article Not Found',
                alternates: {
                    canonical: canonicalUrl,
                },
            };
        }

        const metaDetails = post.meta_details || {};
        const title =
            post.meta_title ||
            metaDetails.meta_title ||
            `${post.title} | Crizbe Blog`;
        const description =
            post.meta_description ||
            metaDetails.meta_description ||
            post.excerpt ||
            'Read the latest gourmet journal stories from Crizbe.';
        const rawKeywords = post.meta_keywords || metaDetails.meta_keywords;
        const keywords = rawKeywords
            ? typeof rawKeywords === 'string'
                ? rawKeywords.split(',').map((k: string) => k.trim()).filter(Boolean)
                : rawKeywords
            : post.keywords || [];

        const ogImage =
            post.cover_image_url ||
            post.cover_image ||
            `${siteUrl}/images/user/og-image.jpeg`;

        const articleCanonicalUrl = `${siteUrl}/blog/${post.slug || slug}`;

        return {
            title,
            description,
            keywords,
            alternates: {
                canonical: articleCanonicalUrl,
            },
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title,
                description,
                type: 'article',
                url: articleCanonicalUrl,
                publishedTime: post.published_at,
                images: [
                    {
                        url: ogImage,
                        alt: post.title,
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
        console.error('Error generating metadata for blog article:', error);
        return {
            title: 'Crizbe Gourmet Journal',
            description: 'Read gourmet stories and chocolate pairing guides from Crizbe.',
            alternates: {
                canonical: canonicalUrl,
            },
        };
    }
}

export default async function Page() {
    return <BlogPostClient />;
}
