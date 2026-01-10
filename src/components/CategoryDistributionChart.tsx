'use client';

export default function CategoryDistributionChart() {
  const categories = [
    { name: 'Smartphones', percentage: 30, color: '#ef4444' },
    { name: 'Laptops', percentage: 25, color: '#3b82f6' },
    { name: 'Furniture', percentage: 18, color: '#eab308' },
    { name: 'Beauty & Personal Care', percentage: 15, color: '#22c55e' },
    { name: 'Gaming Accessories', percentage: 13, color: '#a855f7' },
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

