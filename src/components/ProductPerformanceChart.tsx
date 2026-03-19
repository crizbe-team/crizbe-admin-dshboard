'use client';

interface CategoryData {
    name: string;
    total_kg: number;
}

interface ProductPerformanceChartProps {
    data?: CategoryData[];
}

const COLORS = ['bg-purple-500', 'bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-pink-500'];

export default function ProductPerformanceChart({ data }: ProductPerformanceChartProps) {
    const items = data && data.length > 0 ? data : [];

    const maxVal = items.length > 0 ? Math.max(...items.map((p) => p.total_kg || 0)) : 100;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 text-sm italic">
                No category data available for this period.
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {items.map((item, index) => {
                const percentage = maxVal > 0 ? ((item.total_kg || 0) / maxVal) * 100 : 0;
                const color = COLORS[index % COLORS.length];
                return (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-300">{item.name}</span>
                            <span className="text-xs font-bold text-gray-400 font-mono">
                                {(item.total_kg || 0).toFixed(1)} KG
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
