import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chocolate & Snack Guides',
    description:
        'Explore chocolate and snack guides covering premium chocolate, crunchy chocolate snacks, hazelnut, pistachio, almond and imported chocolate in India.',
    alternates: {
        canonical: 'https://www.crizbe.com/blog',
    },
    openGraph: {
        title: 'Chocolate & Snack Guides for India | Crizbe',
        description:
            'Explore chocolate and snack guides covering premium chocolate, crunchy chocolate snacks, hazelnut, pistachio, almond and imported chocolate in India.',
        url: 'https://www.crizbe.com/blog',
    },
    twitter: {
        title: 'Chocolate & Snack Guides for India | Crizbe',
        description:
            'Explore chocolate and snack guides covering premium chocolate, crunchy chocolate snacks, hazelnut, pistachio, almond and imported chocolate in India.',
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
