import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        absolute: 'Our Story | Crizbe Premium UAE Chocolate',
    },
    description:
        'Discover the Crizbe story and our passion for premium UAE chocolate, crafted to bring rich flavors, crispy textures and indulgent moments to chocolate lovers.',
    alternates: {
        canonical: 'https://www.crizbe.com/our-story',
    },
    openGraph: {
        title: 'Our Story | Crizbe Premium UAE Chocolate',
        description:
            'Discover the Crizbe story and our passion for premium UAE chocolate, crafted to bring rich flavors, crispy textures and indulgent moments to chocolate lovers.',
        url: 'https://www.crizbe.com/our-story',
        images: [
            {
                url: '/images/user/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'Our Story | Crizbe Premium UAE Chocolate',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Story | Crizbe Premium UAE Chocolate',
        description:
            'Discover the Crizbe story and our passion for premium UAE chocolate, crafted to bring rich flavors, crispy textures and indulgent moments to chocolate lovers.',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function OurStoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
