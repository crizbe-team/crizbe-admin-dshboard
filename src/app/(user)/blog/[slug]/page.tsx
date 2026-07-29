import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/constants/blog-data';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Footer from '@/app/_components/Footer';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: 'Article Not Found | Crizbe',
        };
    }

    return {
        title: `${post.title} | Crizbe Gourmet Blog`,
        description: post.excerpt,
        keywords: post.keywords,
        alternates: {
            canonical: `https://crizbe.com/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [post.author.name],
            url: `https://crizbe.com/blog/${post.slug}`,
            images: [
                {
                    url: post.coverImage.startsWith('http')
                        ? post.coverImage
                        : `https://crizbe.com${post.coverImage}`,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const breadcrumbItems = [
        {
            label: <span className="font-[var(--font-inter-tight)] text-[#747474] text-base">Home</span>,
            href: '/',
        },
        {
            label: <span className="font-[var(--font-inter-tight)] text-[#747474] text-base">Blog</span>,
            href: '/blog',
        },
        {
            label: (
                <span className="font-[var(--font-inter-tight)] font-medium text-[#191919] text-base line-clamp-1 max-w-[200px] sm:max-w-none">
                    {post.title}
                </span>
            ),
        },
    ];

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage.startsWith('http')
            ? post.coverImage
            : `https://crizbe.com${post.coverImage}`,
        datePublished: post.publishedAt,
        author: {
            '@type': 'Person',
            name: post.author.name,
            jobTitle: post.author.role,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Crizbe',
            logo: {
                '@type': 'ImageObject',
                url: 'https://crizbe.com/apple-touch-icon.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://crizbe.com/blog/${post.slug}`,
        },
    };

    return (
        <div className="bg-[#FFFDF7] min-h-screen pt-24 pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />

            <article className="wrapper mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-[#9A7236] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                            {post.category}
                        </span>
                        <span className="text-xs text-[#8C7466]">
                            {post.publishedAt} • {post.readTime}
                        </span>
                    </div>

                    <h1 className="text-[#4E3325] text-3xl sm:text-5xl font-bricolage font-bold tracking-tight mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 pt-4 border-t border-[#EADBBD]">
                        <div>
                            <p className="text-sm font-semibold text-[#4E3325]">{post.author.name}</p>
                            <p className="text-xs text-[#8C7466]">{post.author.role}</p>
                        </div>
                    </div>
                </header>

                <div className="relative w-full h-[320px] sm:h-[420px] bg-[#FAF4E6] rounded-2xl mb-12 flex items-center justify-center p-8 overflow-hidden border border-[#EADBBD]">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={280}
                        height={280}
                        className="object-contain max-h-[340px]"
                        priority
                    />
                </div>

                <div
                    className="prose prose-lg max-w-none text-[#4E3325] font-sans leading-relaxed mb-12
                    [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bricolage [&_h2]:font-bold [&_h2]:text-[#4E3325] [&_h2]:mt-8 [&_h2]:mb-4
                    [&_p]:mb-6 [&_p]:text-base [&_p]:sm:text-lg [&_p]:text-[#5E4A3E]
                    [&_p.lead]:text-xl [&_p.lead]:font-medium [&_p.lead]:text-[#4E3325]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="border-t border-b border-[#EADBBD] py-6 mb-12 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-semibold text-[#9A7236] uppercase tracking-wider mr-2">
                        Tags:
                    </span>
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-[#F5EAD4] text-[#6C5549] text-xs font-medium px-3 py-1 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Call to Action Box for Internal Linking to Products */}
                <div className="bg-[#FAF4E6] border border-[#EADBBD] rounded-2xl p-8 text-center mb-16 shadow-xs">
                    <h3 className="text-2xl font-bricolage font-bold text-[#4E3325] mb-2">
                        Ready to Experience the Crunch?
                    </h3>
                    <p className="text-[#6C5549] text-base mb-6 max-w-lg mx-auto">
                        Taste Crizbe&apos;s slender, perfectly layered Belgian chocolate crunch sticks in Hazelnut, Pistachio, and Almond.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block bg-gradient-to-r from-[#9A7236] via-[#E8BF7A] to-[#937854] text-white font-medium text-base px-8 py-3.5 rounded-full shadow-sm hover:opacity-95 transition-opacity"
                    >
                        Explore All Products
                    </Link>
                </div>
            </article>

            <Footer />
        </div>
    );
}
