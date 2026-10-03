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
                <span className="font-[var(--font-inter-tight)] font-medium text-[#191919] text-base inline-block truncate max-w-[160px] sm:max-w-none align-bottom">
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
                    className="prose prose-lg max-w-none text-[#4E3325] font-sans leading-relaxed mb-12 overflow-x-auto
                    [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bricolage [&_h2]:font-bold [&_h2]:text-[#4E3325] [&_h2]:mt-8 [&_h2]:mb-4
                    [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bricolage [&_h3]:font-bold [&_h3]:text-[#4E3325] [&_h3]:mt-6 [&_h3]:mb-3
                    [&_h4]:text-lg [&_h4]:font-bricolage [&_h4]:font-bold [&_h4]:text-[#4E3325] [&_h4]:mt-5 [&_h4]:mb-2
                    [&_p]:mb-6 [&_p]:text-base [&_p]:sm:text-lg [&_p]:text-[#5E4A3E]
                    [&_p.lead]:text-xl [&_p.lead]:font-medium [&_p.lead]:text-[#4E3325]
                    [&_strong]:font-semibold [&_strong]:text-[#4E3325]
                    [&_em]:italic
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-6 [&_ul]:space-y-2.5
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-6 [&_ol]:space-y-2.5
                    [&_li]:text-base [&_li]:sm:text-lg [&_li]:text-[#5E4A3E] [&_li]:pl-1
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[#9A7236] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-[#6C5549]
                    [&_img]:rounded-2xl [&_img]:my-8 [&_img]:mx-auto [&_img]:max-w-full [&_img]:h-auto
                    [&_a]:text-[#9A7236] [&_a]:underline [&_a]:font-medium hover:[&_a]:text-[#4E3325]
                    [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:border [&_table]:border-[#EADBBD] [&_table]:rounded-2xl [&_table]:overflow-hidden [&_table]:shadow-xs
                    [&_thead]:bg-[#FAF4E6] [&_thead]:text-[#4E3325]
                    [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-bricolage [&_th]:font-bold [&_th]:text-sm [&_th]:sm:text-base [&_th]:border-b [&_th]:border-[#EADBBD]
                    [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:sm:text-base [&_td]:text-[#5E4A3E] [&_td]:border-b [&_td]:border-[#EADBBD]/60
                    [&_tr:last-child_td]:border-b-0
                    [&_tr:nth-child(even)]:bg-[#FFFDF7]"
                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
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
