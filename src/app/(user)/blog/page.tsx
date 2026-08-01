'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFetchPublicBlogs } from '@/queries/use-blogs';
import { blogPosts as fallbackBlogPosts } from '@/constants/blog-data';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Footer from '@/app/_components/Footer';

export default function BlogListPage() {
    const { data: publicBlogsRes, isLoading } = useFetchPublicBlogs();
    const dynamicBlogs = publicBlogsRes?.data || [];

    const displayBlogs = dynamicBlogs.length > 0 ? dynamicBlogs : fallbackBlogPosts;

    const breadcrumbItems = [
        {
            label: (
                <span className="font-[var(--font-inter-tight)] text-[#747474] text-base">
                    Home
                </span>
            ),
            href: '/',
        },
        {
            label: (
                <span className="font-[var(--font-inter-tight)] font-medium text-[#191919] text-base">
                    Blog & Articles
                </span>
            ),
        },
    ];

    return (
        <div className="bg-[#FFFDF7] min-h-screen pt-24 pb-12">
            <div className="wrapper mx-auto px-4">
                <div className="mb-8">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-[#9A7236] font-medium text-sm tracking-wider uppercase mb-2 block font-sans">
                        Crizbe Journal & Articles
                    </span>
                    <h1 className="text-[#4E3325] text-3xl sm:text-5xl font-bricolage font-bold tracking-tight mb-4">
                        The Gourmet Chocolate Journal
                    </h1>
                    <p className="text-[#6C5549] text-base sm:text-lg font-sans leading-relaxed">
                        Insights into Belgian chocolate artistry, roasted nut flavor science, and the story behind our luxury crunch sticks.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-[#8C7466]">Loading journal articles...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {displayBlogs.map((post: any) => {
                            const coverImg = post.cover_image_url || post.cover_image || post.coverImage || '/images/user/hazelnut-bottle.png';
                            const category = post.category || 'Gourmet Chocolate';
                            const readTime = post.read_time || post.readTime || '4 min read';
                            const pubDate = post.published_at ? new Date(post.published_at).toISOString().split('T')[0] : (post.publishedAt || '2026-08-01');

                            return (
                                <article
                                    key={post.id}
                                    className="bg-white border border-[#EADBBD] rounded-2xl overflow-hidden shadow-xs flex flex-col hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="relative h-56 w-full bg-[#FAF4E6] flex items-center justify-center p-6 overflow-hidden">
                                        <img
                                            src={coverImg}
                                            alt={post.title}
                                            className="object-contain max-h-48 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <span className="absolute top-4 left-4 bg-[#9A7236] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                                            {category}
                                        </span>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="text-xs text-[#8C7466] mb-2 font-medium font-sans">
                                            {pubDate} • {readTime}
                                        </div>
                                        <h2 className="text-[#4E3325] font-bricolage font-bold text-xl mb-3 leading-snug group-hover:text-[#9A7236] transition-colors">
                                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h2>
                                        <p className="text-[#6C5549] text-sm leading-relaxed mb-6 flex-grow font-sans">
                                            {post.excerpt}
                                        </p>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center text-[#9A7236] font-semibold text-sm hover:underline font-sans"
                                        >
                                            Read Full Article →
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
