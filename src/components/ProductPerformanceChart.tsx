'use client';

interface ProductData {
    id: string;
    name: string;
    category: string;
    quantity_sold: number;
    revenue: number;
}

interface ProductPerformanceChartProps {
    data?: ProductData[];
}

const COLORS = ['bg-purple-500', 'bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-pink-500'];

export default function ProductPerformanceChart({ data }: ProductPerformanceChartProps) {
    const items = data && data.length > 0 ? data : [];

    const maxVal = items.length > 0 ? Math.max(...items.map((p) => p.revenue || 0)) : 100;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 text-sm italic">
                No product performance data available.
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {items.map((item, index) => {
                const percentage = maxVal > 0 ? ((item.revenue || 0) / maxVal) * 100 : 0;
                const color = COLORS[index % COLORS.length];
                return (
                    <div key={item.id || index}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-300">{item.name}</span>
                                <span className="text-xs text-gray-500">{item.category} • {item.quantity_sold} sold</span>
                            </div>
                            <span className="text-sm font-bold text-gray-100 font-mono">
                                ₹{item.revenue.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`${color} h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
