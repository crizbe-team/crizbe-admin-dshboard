'use client';

export default function ProductPerformanceChart() {
  const products = [
    { name: 'Smartphone', sales: 5200, color: 'bg-purple-500' },
    { name: 'Laptop', sales: 4300, color: 'bg-blue-500' },
    { name: 'Coffee Table', sales: 3100, color: 'bg-yellow-500' },
    { name: 'Mouse', sales: 2500, color: 'bg-green-500' },
    { name: 'Running Shoes', sales: 2000, color: 'bg-red-500' },
  ];

  const maxSales = Math.max(...products.map(p => p.sales));

  return (
    <div className="space-y-4">
      {products.map((product, index) => {
        const percentage = (product.sales / maxSales) * 100;
        return (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">{product.name}</span>
              <span className="text-sm font-semibold text-gray-100">
                {product.sales.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-3">
              <div
                className={`${product.color} h-3 rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

