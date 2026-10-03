import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chocolate & Snack Guides',
    description:
        'Explore chocolate and snack guides covering premium chocolate, crunchy chocolate snacks, hazelnut, pistachio, almond and imported chocolate in India.',
    openGraph: {
        title: 'Chocolate & Snack Guides for India | Crizbe',
        description:
            'Explore chocolate and snack guides covering premium chocolate, crunchy chocolate snacks, hazelnut, pistachio, almond and imported chocolate in India.',
        url: 'https://www.crizbe.com/blog',
        images: [
            {
                url: '/images/user/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'Crizbe Chocolate & Snack Guides',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chocolate & Snack Guides for India | Crizbe',
        description:
            'Explore chocolate and snack guides covering premium chocolate, crunchy chocolate snacks, hazelnut, pistachio, almond and imported chocolate in India.',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
