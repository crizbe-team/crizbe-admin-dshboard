'use client';

import {
  DollarSign,
  Users,
  Package,
  Box
} from 'lucide-react';
import SalesOverviewChart from '@/components/SalesOverviewChart';
import CategoryDistributionChart from '@/components/CategoryDistributionChart';
import OrderStatusChart from '@/components/OrderStatusChart';
import ProductPerformanceChart from '@/components/ProductPerformanceChart';

const stats = [
  {
    title: 'Total Sales',
    value: '$182,450',
    icon: DollarSign,
    color: 'text-blue-400',
  },
  {
    title: 'Total Clients',
    value: '1,437',
    icon: Users,
    color: 'text-green-400',
  },
  {
    title: 'Total Products',
    value: '674',
    icon: Package,
    color: 'text-purple-400',
  },

];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                </div>
                <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Sales Overview</h2>
          <SalesOverviewChart />
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Category Distribution</h2>
          <CategoryDistributionChart />
        </div>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Order Status Distribution</h2>
          <OrderStatusChart />
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Product Performance</h2>
          <ProductPerformanceChart />
        </div>
      </div>
    </div>
  );
}
