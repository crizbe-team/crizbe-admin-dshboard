import React from 'react';
import OrdersList from '../components/OrdersList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Orders',
    description: 'View your order history and track current orders.',
};
export default function MyOrdersPage() {
    return (
        <main className="min-h-[75vh]">
            <OrdersList />
        </main>
    );
}
