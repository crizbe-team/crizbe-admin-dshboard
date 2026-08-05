'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { useFetchPublicBlogDetail } from '@/queries/use-blogs';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Footer from '@/app/_components/Footer';

import SectionLoader from '@/components/ui/SectionLoader';

export default function BlogPostPage() {
    const params = useParams();
    const slug = typeof params?.slug === 'string' ? params.slug : '';

    const { data: detailRes, isLoading } = useFetchPublicBlogDetail(slug);
    const post = detailRes?.data;

    if (!isLoading && !post) {
        return notFound();
    }

    if (isLoading && !post) {
        return (
            <div className="bg-[#FFFDF7] min-h-screen pt-32 flex items-center justify-center">
                <SectionLoader text="Loading article details..." minHeight="min-h-[400px]" />
            </div>
        );
    }

    if (!post) return null;

    const coverImg = post.cover_image_url || post.cover_image || '/images/user/hazelnut-bottle.png';
    const category = post.category || 'Gourmet Chocolate';
    const readTime = post.read_time || '4 min read';
    const pubDate = post.published_at ? new Date(post.published_at).toISOString().split('T')[0] : '2026-08-01';
    const authorName = post.author_name || post.author?.name || 'Crizbe Culinary Team';
    const authorRole = post.author_role || post.author?.role || 'Master Chocolatier';
    const tagsList = post.tags || [];

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
        image: coverImg,
        datePublished: pubDate,
        author: {
            '@type': 'Person',
            name: authorName,
            jobTitle: authorRole,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Crizbe',
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
                        <span className="bg-[#9A7236] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                            {category}
                        </span>
                        <span className="text-xs text-[#8C7466] font-sans">
                            {pubDate} • {readTime}
                        </span>
                    </div>

                    <h1 className="text-[#4E3325] text-3xl sm:text-5xl font-bricolage font-bold tracking-tight mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 pt-4 border-t border-[#EADBBD]">
                        <div>
                            <p className="text-sm font-semibold text-[#4E3325] font-sans">{authorName}</p>
                            <p className="text-xs text-[#8C7466] font-sans">{authorRole}</p>
                        </div>
                    </div>
                </header>

                <div className="relative w-full h-[320px] sm:h-[420px] bg-[#FAF4E6] rounded-2xl mb-12 flex items-center justify-center p-8 overflow-hidden border border-[#EADBBD]">
                    <img
                        src={coverImg}
                        alt={post.title}
                        className="object-contain max-h-[340px]"
                    />
                </div>

                <div
                    className="prose prose-lg max-w-none text-[#4E3325] font-sans leading-relaxed mb-12
                    [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bricolage [&_h2]:font-bold [&_h2]:text-[#4E3325] [&_h2]:mt-8 [&_h2]:mb-4
                    [&_p]:mb-6 [&_p]:text-base [&_p]:sm:text-lg [&_p]:text-[#5E4A3E]
                    [&_p.lead]:text-xl [&_p.lead]:font-medium [&_p.lead]:text-[#4E3325]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {tagsList.length > 0 && (
                    <div className="border-t border-b border-[#EADBBD] py-6 mb-12 flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-semibold text-[#9A7236] uppercase tracking-wider mr-2 font-sans">
                            Tags:
                        </span>
                        {tagsList.map((tag: string) => (
                            <span
                                key={tag}
                                className="bg-[#F5EAD4] text-[#6C5549] text-xs font-medium px-3 py-1 rounded-full font-sans"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Call to Action Box for Internal Linking to Products */}
                <div className="bg-[#FAF4E6] border border-[#EADBBD] rounded-2xl p-8 text-center mb-16 shadow-xs">
                    <h3 className="text-2xl font-bricolage font-bold text-[#4E3325] mb-2">
                        Ready to Experience the Crunch?
                    </h3>
                    <p className="text-[#6C5549] text-base mb-6 max-w-lg mx-auto font-sans">
                        Taste Crizbe&apos;s slender, perfectly layered Belgian chocolate crunch sticks in Hazelnut, Pistachio, and Almond.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block bg-gradient-to-r from-[#9A7236] via-[#E8BF7A] to-[#937854] text-white font-medium text-base px-8 py-3.5 rounded-full shadow-sm hover:opacity-95 transition-opacity font-sans"
                    >
                        Explore All Products
                    </Link>
                </div>
            </article>

            <Footer />
        </div>
    );
}
