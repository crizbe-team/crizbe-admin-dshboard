import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Story',
    description:
        'Discover the journey behind Crizbe—where passion for luxury meet exceptional crunch. Learn about our craft and commitment to premium quality.',
    keywords: ['Crizbe story', 'luxury snacks', 'premium chocolate', 'brand journey'],
    openGraph: {
        title: 'Our Story | Crizbe',
        description: 'Explore the journey of Crizbe and our commitment to premium crunch sticks.',
        images: ['/images/user/our-story.png'],
    },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
