'use client';

export default function OrderStatusChart() {
  const orderStatuses = [
    { status: 'Completed', count: 13500, color: 'bg-green-500' },
    { status: 'Pending', count: 1120, color: 'bg-yellow-500' },
    { status: 'Canceled', count: 620, color: 'bg-red-500' },
  ];

  const total = orderStatuses.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      {orderStatuses.map((item, index) => {
        const percentage = (item.count / total) * 100;
        return (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">{item.status}</span>
              <span className="text-sm font-semibold text-gray-100">
                {item.count.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-3">
              <div
                className={`${item.color} h-3 rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

