import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Notifications',
    description: 'System alerts and user notifications.',
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
