import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Manage Categories | Crizbe Admin',
    description: 'Create, update, and manage product categories.',
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
