'use client';

import {
  IndianRupee,
  Users,
  Package,
  Loader2
} from 'lucide-react';
import SalesOverviewChart from '@/components/SalesOverviewChart';
import CategoryDistributionChart from '@/components/CategoryDistributionChart';
import OrderStatusChart from '@/components/OrderStatusChart';
import ProductPerformanceChart from '@/components/ProductPerformanceChart';
import { useFetchAdminDashboardOverview } from '@/queries/use-orders';

export default function Dashboard() {
  const { data: overviewResponse, isLoading, isError } = useFetchAdminDashboardOverview();
  const overviewData = overviewResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        Failed to load dashboard overview data. Please try again later.
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Sales',
      value: `₹${(overviewData?.total_sales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: IndianRupee,
      color: 'text-blue-400',
    },
    {
      title: 'Total Clients',
      value: (overviewData?.total_clients || 0).toLocaleString(),
      icon: Users,
      color: 'text-green-400',
    },
    {
      title: 'Total Products',
      value: (overviewData?.total_products || 0).toLocaleString(),
      icon: Package,
      color: 'text-purple-400',
    },
  ];

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
          <SalesOverviewChart data={overviewData?.sales_overview} />
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Category Distribution</h2>
          <CategoryDistributionChart data={overviewData?.category_distribution} />
        </div>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Order Status Distribution</h2>
          <OrderStatusChart data={overviewData?.order_status_distribution} />
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Product Performance</h2>
          <ProductPerformanceChart data={overviewData?.product_performance} />
        </div>
      </div>
    </div>
  );
}
