import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        absolute: 'About Crizbe | Premium Chocolate Brand in India',
    },
    description:
        'Discover Crizbe, a premium chocolate snack brand bringing crispy crunch sticks with hazelnut, pistachio and almond flavours to chocolate lovers across India.',
    keywords: [
        'Crizbe story',
        'luxury chocolate brand',
        'Belgian chocolate crunch sticks',
        'gourmet chocolate heritage',
        'artisanal chocolate snacks',
    ],
    alternates: {
        canonical: 'https://crizbe.com/our-story',
    },
    openGraph: {
        title: 'About Crizbe | Premium Chocolate Brand in India',
        description:
            'Discover Crizbe, a premium chocolate snack brand bringing crispy crunch sticks with hazelnut, pistachio and almond flavours to chocolate lovers across India.',
        url: 'https://crizbe.com/our-story',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
