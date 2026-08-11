import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        absolute: 'Chocolate & Snack Guides for India | Crizbe',
    },
    description:
        'Explore chocolate and snack guides covering premium chocolate, crunchy chocolate snacks, hazelnut, pistachio, almond and imported chocolate in India.',
    keywords: [
        'chocolate guides',
        'snack guides India',
        'premium chocolate snacks',
        'crunchy chocolate sticks',
        'hazelnut chocolate',
        'pistachio chocolate',
        'almond chocolate',
    ],
    alternates: {
        canonical: 'https://crizbe.com/blog',
    },
    openGraph: {
        title: 'Chocolate & Snack Guides for India | Crizbe',
        description:
            'Explore chocolate and snack guides covering premium chocolate, crunchy chocolate snacks, hazelnut, pistachio, almond and imported chocolate in India.',
        url: 'https://crizbe.com/blog',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
