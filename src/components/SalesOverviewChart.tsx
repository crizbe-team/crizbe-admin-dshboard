'use client';

import React, { useState } from 'react';

interface SalesPoint {
    month: string;
    sales: number;
}

export default function SalesOverviewChart({ data = [] }: { data?: SalesPoint[] }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const salesData: SalesPoint[] = data.length > 0 ? data : [
        { month: 'Jan', sales: 0 },
        { month: 'Feb', sales: 0 },
        { month: 'Mar', sales: 0 },
        { month: 'Apr', sales: 0 },
        { month: 'May', sales: 0 },
        { month: 'Jun', sales: 0 },
        { month: 'Jul', sales: 0 },
        { month: 'Aug', sales: 0 },
        { month: 'Sep', sales: 0 },
        { month: 'Oct', sales: 0 },
        { month: 'Nov', sales: 0 },
        { month: 'Dec', sales: 0 },
    ];

    const maxSalesRaw = Math.max(...salesData.map(d => d.sales), 1000);
    const maxSales = Math.ceil(maxSalesRaw / 1000) * 1000 || 1000;

    const width = 600;
    const height = 180;
    const padding = { top: 20, right: 20, bottom: 30, left: 45 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = salesData.map((d, i) => {
        const x = padding.left + (i / Math.max(salesData.length - 1, 1)) * chartWidth;
        const y = padding.top + chartHeight - (d.sales / maxSales) * chartHeight;
        return { x, y, month: d.month, sales: d.sales };
    });

    // Generate smooth SVG curve (Catmull-Rom / Bezier control points)
    const createSmoothPath = (pts: { x: number; y: number }[]) => {
        if (pts.length === 0) return '';
        if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

        let path = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const current = pts[i];
            const next = pts[i + 1];
            const controlX = (current.x + next.x) / 2;
            path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
        }
        return path;
    };

    const linePath = createSmoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

    const yTicks = [0, maxSales * 0.25, maxSales * 0.5, maxSales * 0.75, maxSales];

    return (
        <div className="w-full flex flex-col justify-between h-full">
            <div className="relative w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto overflow-visible select-none"
                >
                    <defs>
                        <linearGradient id="crizbeGoldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E8BF7A" stopOpacity="0.4" />
                            <stop offset="60%" stopColor="#C4994A" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#C4994A" stopOpacity="0" />
                        </linearGradient>

                        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {yTicks.map((tick, i) => {
                        const y = padding.top + chartHeight - (tick / maxSales) * chartHeight;
                        return (
                            <g key={i}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={width - padding.right}
                                    y2={y}
                                    stroke="rgba(255, 255, 255, 0.06)"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding.left - 8}
                                    y={y + 3}
                                    fill="#A3A3A3"
                                    fontSize="10"
                                    textAnchor="end"
                                    className="font-mono font-medium"
                                >
                                    ₹{tick >= 1000 ? `${(tick / 1000).toFixed(tick % 1000 === 0 ? 0 : 1)}k` : tick}
                                </text>
                            </g>
                        );
                    })}

                    {/* Area Gradient Fill */}
                    <path d={areaPath} fill="url(#crizbeGoldGradient)" />

                    {/* Glowing Stroke Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#E8BF7A"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#goldGlow)"
                    />

                    {/* Interactive Data Points */}
                    {points.map((pt, i) => {
                        const isHovered = hoveredIndex === i;
                        return (
                            <g
                                key={i}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="cursor-pointer"
                            >
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isHovered ? "6" : "3.5"}
                                    fill={isHovered ? "#FFF" : "#E8BF7A"}
                                    stroke="#141414"
                                    strokeWidth="2"
                                    className="transition-all duration-200"
                                />
                                {isHovered && (
                                    <g>
                                        <rect
                                            x={Math.max(10, Math.min(width - 90, pt.x - 40))}
                                            y={Math.max(5, pt.y - 38)}
                                            width="80"
                                            height="26"
                                            rx="6"
                                            fill="#1E1E1E"
                                            stroke="#E8BF7A"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={Math.max(50, Math.min(width - 50, pt.x))}
                                            y={Math.max(22, pt.y - 21)}
                                            fill="#FFF"
                                            fontSize="10"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                        >
                                            ₹{pt.sales.toLocaleString()}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}

                    {/* Month Labels */}
                    {points.map((pt, i) => (
                        <text
                            key={i}
                            x={pt.x}
                            y={height - 8}
                            fill={hoveredIndex === i ? "#E8BF7A" : "#8E8E93"}
                            fontSize="10"
                            fontWeight={hoveredIndex === i ? "bold" : "normal"}
                            textAnchor="middle"
                        >
                            {pt.month}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    );
}
