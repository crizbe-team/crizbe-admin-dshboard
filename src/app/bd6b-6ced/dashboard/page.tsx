'use client';

import {
  IndianRupee,
  Users,
  Package,
  LayoutDashboard,
  RefreshCw,
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import SalesOverviewChart from '@/components/SalesOverviewChart';
import CategoryDistributionChart from '@/components/CategoryDistributionChart';
import OrderStatusChart from '@/components/OrderStatusChart';
import ProductPerformanceChart from '@/components/ProductPerformanceChart';
import { useFetchAdminDashboardOverview } from '@/queries/use-orders';
import DashboardLoader from '@/components/ui/DashboardLoader';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

export default function Dashboard() {
  const { data: overviewResponse, isLoading, isError, isRefetching, refetch } = useFetchAdminDashboardOverview();
  const overviewData = overviewResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <DashboardLoader text="Loading Dashboard Control Center..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-rose-400 font-semibold bg-[#141414] rounded-3xl border border-white/10 p-8">
        Failed to load dashboard overview data. Please check connection and try again.
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Sales Revenue',
      value: `₹${(overviewData?.total_sales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: IndianRupee,
      color: 'text-[#E8BF7A]',
    },
    {
      title: 'Total Registered Clients',
      value: (overviewData?.total_clients || 0).toLocaleString(),
      icon: Users,
      color: 'text-emerald-400',
    },
    {
      title: 'Active Products',
      value: (overviewData?.total_products || 0).toLocaleString(),
      icon: Package,
      color: 'text-amber-300',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-16 max-w-7xl mx-auto"
    >
      {/* Page Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-bricolage tracking-tight leading-none flex items-center gap-3">
            <LayoutDashboard className="w-9 h-9 text-[#E8BF7A]" />
            Control Center Overview
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-medium">
            Global overview of Crizbe luxury operations, sales channels & customer metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-semibold transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh Overview
          </button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-[#141414] rounded-3xl p-6 border border-white/10 transition-all hover:border-[#E8BF7A]/30 group relative overflow-hidden shadow-xl"
            >
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-center justify-between">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-[#E8BF7A]">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-extrabold text-white font-bricolage tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white font-bricolage mb-4 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8BF7A] shadow-[0_0_8px_#E8BF7A]" />
            Sales Trend Revenue
          </h2>
          <SalesOverviewChart data={overviewData?.sales_overview} />
        </div>

        <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white font-bricolage mb-4 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C4994A] shadow-[0_0_8px_#C4994A]" />
            Category Volume Distribution
          </h2>
          <CategoryDistributionChart data={overviewData?.category_distribution} />
        </div>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white font-bricolage mb-4 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
            Order Status Lifecycle
          </h2>
          <OrderStatusChart data={overviewData?.order_status_distribution} />
        </div>

        <div className="bg-[#141414] rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white font-bricolage mb-4 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8BF7A] shadow-[0_0_8px_#E8BF7A]" />
            Product Unit Sales
          </h2>
          <ProductPerformanceChart data={overviewData?.product_performance} />
        </div>
      </motion.div>
    </motion.div>
  );
}
