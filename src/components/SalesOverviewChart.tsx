'use client';

export default function SalesOverviewChart() {
  // Sample data for the sales overview chart
  const salesData = [
    { month: 'Jan', sales: 3200 },
    { month: 'Feb', sales: 4100 },
    { month: 'Mar', sales: 3800 },
    { month: 'Apr', sales: 5200 },
    { month: 'May', sales: 6100 },
    { month: 'Jun', sales: 7500 },
    { month: 'Jul', sales: 6800 },
    { month: 'Aug', sales: 5400 },
    { month: 'Sep', sales: 6200 },
    { month: 'Oct', sales: 7100 },
    { month: 'Nov', sales: 7800 },
    { month: 'Dec', sales: 8200 },
  ];

  const maxSales = 8000;
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
        <span>2000</span>
        <span>4000</span>
        <span>6000</span>
        <span>8000</span>
      </div>
    </div>
  );
}

