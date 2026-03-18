import OrderCard, { Order } from './OrderCard';

const orders: Order[] = [
    {
        id: '000004085',
        date: 'Jan 10, 2024',
        status: 'Delivered',
        total: '₹949.00',
        items: [
            {
                title: 'Crunch Stick Almond',
                weight: '100 g',
                qty: 1,
                price: '₹250.00',
                image: '/images/product1.png', // Just dummy url, but we need something that works
            },
        ],
    },
    {
        id: '000004086',
        date: 'Jan 10, 2024',
        status: 'Delivered',
        total: '₹949.00',
        items: [
            {
                title: 'Crunch Stick Almond',
                weight: '100 g',
                qty: 1,
                price: '₹250.00',
                image: '/images/product1.png',
            },
            {
                title: 'Crunch Stick Almond, Pistachio, chocolate hamber',
                weight: '200 g',
                qty: 1,
                price: '₹699.00',
                image: '/images/product2.png',
            },
        ],
    },
];

import { Search } from 'lucide-react';

export default function OrdersList() {
    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
                <div>
                    <h1 className="text-[22px] font-medium text-[#1A1A1A]">My orders</h1>
                </div>
                <div className="flex items-center gap-2 relative">
                    <label className="sr-only" htmlFor="order-search">
                        Search orders
                    </label>
                    <Search
                        className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#999999] h-[18px] w-[18px]"
                        strokeWidth={2}
                    />
                    <input
                        id="order-search"
                        type="text"
                        placeholder="Search orders"
                        className="h-[44px] w-full sm:w-[480px] rounded-[10px] border border-[#EEEEEE] bg-white pl-[42px] pr-4 text-[13px] text-[#333333] outline-none placeholder:text-[#999999] focus:border-[#E8BF7A] focus:ring-1 focus:ring-[#E8BF7A]"
                    />
                </div>
            </div>

            <div className="grid gap-[22px]">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}
