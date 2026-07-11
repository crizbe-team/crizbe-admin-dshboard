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
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-white font-bricolage tracking-tight leading-none">
          Control Center
        </h1>
        <p className="text-gray-400 text-base font-medium">
          Global overview of business operations, sales channels & client lifecycle.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const bgClass = stat.color.includes('blue') ? 'bg-blue-500/10' : stat.color.includes('green') ? 'bg-green-500/10' : 'bg-purple-500/10';
          const glowClass = stat.color.includes('blue') ? 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]' : stat.color.includes('green') ? 'hover:shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]' : 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]';
          return (
            <div
              key={stat.title}
              className={`bg-[#1a1a1a]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 transition-all group relative overflow-hidden ${glowClass}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
              <div className="flex flex-col h-full justify-between gap-6">
                <div className="flex items-center justify-between">
                  <div className={`${bgClass} ${stat.color} p-3.5 rounded-2xl`}>
                    <Icon className="w-5 h-5 shadow-lg" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-none">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-black text-white font-mono tracking-tighter">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Sales Overview</h2>
          <SalesOverviewChart data={overviewData?.sales_overview} />
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Category Distribution</h2>
          <CategoryDistributionChart data={overviewData?.category_distribution} />
        </div>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Order Status Distribution</h2>
          <OrderStatusChart data={overviewData?.order_status_distribution} />
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Product Performance</h2>
          <ProductPerformanceChart data={overviewData?.product_performance} />
        </div>
      </div>
    </div>
  );
}
