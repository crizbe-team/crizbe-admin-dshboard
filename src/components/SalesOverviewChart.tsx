'use client';

export default function SalesOverviewChart({ data = [] }: { data?: { month: string; sales: number }[] }) {
    const salesData = data.length > 0 ? data : [
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

    const maxSales = Math.max(...salesData.map(d => d.sales), 1000);
    const chartHeight = 200;
    const chartWidth = 100;

    // Calculate points for line chart
    const points = salesData.map((data, index) => {
        const x = (index / (salesData.length - 1)) * chartWidth;
        const y = chartHeight - (data.sales / maxSales) * chartHeight;
        return { x, y, ...data };
    });

    // Create path for line
    const pathData = points.map((point, index) => {
        return `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}`;
    }).join(' ');

    // Create area path (for gradient fill)
    const areaPath = `${pathData} L ${points[points.length - 1].x}% ${chartHeight} L ${points[0].x}% ${chartHeight} Z`;

    return (
        <div className="w-full">
            <svg width="100%" height="200" className="mb-4">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d={areaPath}
                    fill="url(#lineGradient)"
                />
                <path
                    d={pathData}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {points.map((point, index) => (
                    <circle
                        key={index}
                        cx={`${point.x}%`}
                        cy={point.y}
                        r="4"
                        fill="#a855f7"
                    />
                ))}
            </svg>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                {salesData.map((data, index) => (
                    <span key={index} className="text-gray-400">{data.month}</span>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0</span>
                <span>{Math.round(maxSales * 0.25)}</span>
                <span>{Math.round(maxSales * 0.5)}</span>
                <span>{Math.round(maxSales * 0.75)}</span>
                <span>{Math.round(maxSales)}</span>
            </div>
        </div>
    );
}

