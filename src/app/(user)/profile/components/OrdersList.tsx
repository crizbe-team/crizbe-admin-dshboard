import OrderCard, { Order } from './OrderCard';

const orders: Order[] = [
    {
        id: 'ORD-000123',
        date: 'Jan 12, 2024',
        status: 'Delivered',
        total: '₹250.00',
        item: {
            title: 'Crunch Stick Almond',
            weight: '100 g',
            qty: 1,
            image: 'https://images.unsplash.com/photo-1600185365449-2ecb63f7aa9c?auto=format&fit=crop&w=500&q=80',
        },
    },
    {
        id: 'ORD-000124',
        date: 'Jan 12, 2024',
        status: 'Delivered',
        total: '₹699.00',
        item: {
            title: 'Crunch Stick Almond, Pistachio, chocolate hamper',
            weight: '350 g',
            qty: 1,
            image: 'https://images.unsplash.com/photo-1600185365449-2ecb63f7aa9c?auto=format&fit=crop&w=500&q=80',
        },
    },
    {
        id: 'ORD-000125',
        date: 'Jan 12, 2024',
        status: 'Delivered',
        total: '₹250.00',
        item: {
            title: 'Crunch Stick Almond',
            weight: '100 g',
            qty: 1,
            image: 'https://images.unsplash.com/photo-1600185365449-2ecb63f7aa9c?auto=format&fit=crop&w=500&q=80',
        },
    },
];

export default function OrdersList() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">My orders</h1>
                </div>
                <div className="flex items-center gap-2">
                    <label className="sr-only" htmlFor="order-search">
                        Search orders
                    </label>
                    <input
                        id="order-search"
                        type="text"
                        placeholder="Search orders"
                        className="h-10 w-[550px] max-w-xs rounded-lg border border-gray-200 bg-white/80 px-4 text-sm text-gray-700 shadow-sm outline-none focus:border-[#E8BF7A] focus:ring-2 focus:ring-[#E8BF7A]/30"
                    />
                </div>
            </div>

            <div className="grid gap-6 max-h-[70vh] overflow-y-auto pr-2">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}
