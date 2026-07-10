'use client';

const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#f97316', '#06b6d4', '#ec4899'];

export default function CategoryDistributionChart({ data = [] }: { data?: { name: string; percentage: number }[] }) {
    const categories = data.length > 0 ? data.map((d, index) => ({
        name: d.name,
        percentage: d.percentage,
        color: COLORS[index % COLORS.length]
    })) : [
        { name: 'No Data Available', percentage: 100, color: '#6b7280' }
    ];

    // Calculate angles for pie chart segments
    let currentAngle = 0;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    const segments = categories.map((category) => {
        const angle = (category.percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);

        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z',
        ].join(' ');

        return { ...category, pathData, startAngle, endAngle };
    });

    return (
        <div className="flex flex-col items-center">
            <svg width="200" height="200" className="mb-6">
                {segments.map((segment, index) => (
                    <path
                        key={index}
                        d={segment.pathData}
                        fill={segment.color}
                    />
                ))}
            </svg>
            <div className="w-full space-y-2">
                {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            <span className="text-sm text-gray-300">{category.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-100">
                            {category.percentage}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

