import React from 'react';
import Metadata from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/constants/blog-data';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Footer from '@/app/_components/Footer';

export const metadata = {
    title: 'Gourmet Chocolate & Confectionery Blog | Crizbe',
    description:
        'Explore articles on Belgian chocolate craftsmanship, flavor pairings with hazelnut, pistachio, and almond, and luxury dessert trends from Crizbe.',
    keywords: [
        'Belgian chocolate blog',
        'chocolate crunch sticks articles',
        'gourmet snacks guide',
        'hazelnut pistachio almond chocolate',
    ],
    alternates: {
        canonical: 'https://crizbe.com/blog',
    },
    openGraph: {
        title: 'Gourmet Chocolate & Confectionery Blog | Crizbe',
        description: 'Discover stories, flavor pairing guides, and craftsmanship behind Crizbe crunch sticks.',
        url: 'https://crizbe.com/blog',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function BlogListPage() {
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
                    <span className="text-[#9A7236] font-medium text-sm tracking-wider uppercase mb-2 block">
                        Crizbe Journal & Articles
                    </span>
                    <h1 className="text-[#4E3325] text-3xl sm:text-5xl font-bricolage font-bold tracking-tight mb-4">
                        The Gourmet Chocolate Journal
                    </h1>
                    <p className="text-[#6C5549] text-base sm:text-lg font-sans leading-relaxed">
                        Insights into Belgian chocolate artistry, roasted nut flavor science, and the story behind our luxury crunch sticks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {blogPosts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white border border-[#EADBBD] rounded-2xl overflow-hidden shadow-xs flex flex-col hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="relative h-56 w-full bg-[#FAF4E6] flex items-center justify-center p-6 overflow-hidden">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    width={180}
                                    height={180}
                                    className="object-contain max-h-48 group-hover:scale-105 transition-transform duration-300"
                                />
                                <span className="absolute top-4 left-4 bg-[#9A7236] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {post.category}
                                </span>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="text-xs text-[#8C7466] mb-2 font-medium">
                                    {post.publishedAt} • {post.readTime}
                                </div>
                                <h2 className="text-[#4E3325] font-bricolage font-bold text-xl mb-3 leading-snug group-hover:text-[#9A7236] transition-colors">
                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="text-[#6C5549] text-sm leading-relaxed mb-6 flex-grow">
                                    {post.excerpt}
                                </p>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center text-[#9A7236] font-semibold text-sm hover:underline"
                                >
                                    Read Full Article →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
