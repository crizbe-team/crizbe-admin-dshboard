import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Story | Crafted Belgian Chocolate Crunch Sticks & Gourmet Heritage',
    description:
        'Discover the journey behind Crizbe—where passion for luxury Belgian chocolate meets slender, perfectly layered crunch sticks crafted with real hazelnut, pistachio, and almond.',
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
        title: 'Our Story | Crafted Belgian Chocolate Crunch Sticks & Gourmet Heritage',
        description: 'Explore the journey of Crizbe and our commitment to premium crunch sticks.',
        url: 'https://crizbe.com/our-story',
        images: ['/images/user/og-image.jpeg'],
    },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
