import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Story',
    description:
        'Discover Crizbe, a premium chocolate snack brand bringing crispy crunch sticks with hazelnut, pistachio and almond flavours to chocolate lovers across India.',
    alternates: {
        canonical: 'https://www.crizbe.com/our-story',
    },
    openGraph: {
        title: 'About Crizbe | Premium Chocolate Brand in India',
        description:
            'Discover Crizbe, a premium chocolate snack brand bringing crispy crunch sticks with hazelnut, pistachio and almond flavours to chocolate lovers across India.',
        url: 'https://www.crizbe.com/our-story',
    },
    twitter: {
        title: 'About Crizbe | Premium Chocolate Brand in India',
        description:
            'Discover Crizbe, a premium chocolate snack brand bringing crispy crunch sticks with hazelnut, pistachio and almond flavours to chocolate lovers across India.',
    },
};

export default function OurStoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
