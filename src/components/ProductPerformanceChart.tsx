'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

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

export default function ProductPerformanceChart({ data }: ProductPerformanceChartProps) {
    const items = data && data.length > 0 ? data : [];
    const maxVal = items.length > 0 ? Math.max(...items.map((p) => Number(p.revenue) || 0)) : 100;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-xs italic space-y-2">
                <ShoppingBag className="w-8 h-8 text-gray-600 stroke-[1.5]" />
                <span>No product performance metrics recorded yet.</span>
            </div>
        );
    }

    return (
        <div className="space-y-3.5 py-1">
            {items.map((item, index) => {
                const revenue = Number(item?.revenue) || 0;
                const percentage = maxVal > 0 ? (revenue / maxVal) * 100 : 0;

                return (
                    <div
                        key={item.id || index}
                        className="bg-white/5 border border-white/5 rounded-2xl p-3.5 space-y-2 hover:border-[#E8BF7A]/20 transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3 min-w-0">
                                <span className="w-5 h-5 rounded-md bg-[#E8BF7A]/10 border border-[#E8BF7A]/20 text-[#E8BF7A] text-[10px] font-bold flex items-center justify-center font-mono">
                                    #{index + 1}
                                </span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[220px]">
                                        {item.name}
                                    </span>
                                    <span className="text-[11px] font-medium text-gray-400">
                                        {item.category} • <span className="text-gray-300 font-semibold">{item.quantity_sold} sold</span>
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs font-extrabold text-[#E8BF7A] font-mono">
                                ₹{revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        {/* Gold Gradient Progress Bar */}
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#E8BF7A] via-[#D4AF37] to-[#C4994A] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(232,191,122,0.3)]"
                                style={{ width: `${Math.max(percentage, 4)}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
