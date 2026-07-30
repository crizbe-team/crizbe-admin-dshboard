'use client';

import React, { useState } from 'react';

const LUXURY_COLORS = [
    { color: '#E8BF7A', label: 'Gold' },
    { color: '#C4994A', label: 'Amber Gold' },
    { color: '#D4AF37', label: 'Classic Gold' },
    { color: '#34D399', label: 'Emerald' },
    { color: '#60A5FA', label: 'Sapphire' },
    { color: '#A78BFA', label: 'Amethyst' },
];

export default function CategoryDistributionChart({ data = [] }: { data?: { name: string; percentage: number }[] }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const categories = data.length > 0 ? data.map((d, index) => ({
        name: d.name,
        percentage: Number(d.percentage) || 0,
        color: LUXURY_COLORS[index % LUXURY_COLORS.length].color,
    })) : [
        { name: 'No Category Data', percentage: 100, color: '#4B5563' }
    ];

    const size = 180;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = 0;

    const segments = categories.map((cat) => {
        const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
        const strokeDashoffset = -currentOffset;
        currentOffset += (cat.percentage / 100) * circumference;
        return { ...cat, strokeDasharray, strokeDashoffset };
    });

    const activeItem = hoveredIndex !== null ? categories[hoveredIndex] : categories[0];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            {/* Donut Chart Container */}
            <div className="relative flex items-center justify-center select-none">
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background Ring */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />

                    {/* Donut Segments */}
                    {segments.map((seg, i) => {
                        const isHovered = hoveredIndex === i;
                        return (
                            <circle
                                key={i}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={seg.color}
                                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                                strokeDasharray={seg.strokeDasharray}
                                strokeDashoffset={seg.strokeDashoffset}
                                fill="transparent"
                                className="transition-all duration-300 cursor-pointer origin-center"
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        );
                    })}
                </svg>

                {/* Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-white font-bricolage leading-none">
                        {activeItem ? `${activeItem.percentage}%` : '100%'}
                    </span>
                    <span className="text-[11px] font-medium text-gray-400 truncate max-w-[100px] mt-1">
                        {activeItem?.name || 'Total'}
                    </span>
                </div>
            </div>

            {/* Category Legend List */}
            <div className="w-full sm:w-auto flex-1 space-y-2.5">
                {categories.map((category, index) => {
                    const isHovered = hoveredIndex === index;
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                                isHovered ? 'bg-white/10 border border-white/10' : 'bg-white/5 border border-transparent'
                            }`}
                        >
                            <div className="flex items-center space-x-2.5 min-w-0">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="text-xs font-semibold text-gray-200 truncate">
                                    {category.name}
                                </span>
                            </div>
                            <span
                                className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white"
                            >
                                {category.percentage}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
