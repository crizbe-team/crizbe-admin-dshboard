'use client';

import {
  IndianRupee,
  Users,
  Package,
  LayoutDashboard,
  RefreshCw,
  ShoppingCart,
  Tags,
  Boxes,
  Mail,
  FileText,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Shield,
  CheckCircle2,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import SalesOverviewChart from '@/components/SalesOverviewChart';
import CategoryDistributionChart from '@/components/CategoryDistributionChart';
import OrderStatusChart from '@/components/OrderStatusChart';
import ProductPerformanceChart from '@/components/ProductPerformanceChart';
import { useFetchAdminDashboardOverview } from '@/queries/use-orders';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { authUtils } from '@/utils/auth';
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

// Module Quick Action Cards for Non-Confidential Dashboard
const ALL_MODULE_CARDS = [
    {
        perm: 'products',
        title: 'Products Management',
        description: 'Manage luxury product catalog, pricing, variants, and SEO meta details.',
        icon: Package,
        path: '/bd6b-6ced/dashboard/products',
        color: 'text-[#E8BF7A]',
        bgColor: 'bg-[#E8BF7A]/10 border-[#E8BF7A]/20',
    },
    {
        perm: 'orders',
        title: 'Order Processing',
        description: 'Track incoming customer orders, update statuses, and print 4x6" shipping labels.',
        icon: ShoppingCart,
        path: '/bd6b-6ced/dashboard/orders',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
        perm: 'categories',
        title: 'Categories',
        description: 'Organize product categories and brand taxonomies.',
        icon: Tags,
        path: '/bd6b-6ced/dashboard/categories',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
        perm: 'stock',
        title: 'Inventory & Stock',
        description: 'Monitor bulk stock imports, sub-variant inventory balances, and alerts.',
        icon: Boxes,
        path: '/bd6b-6ced/dashboard/stock',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
        perm: 'enquiries',
        title: 'Enquiries & Support',
        description: 'View customer inquiries, wholesale pre-orders, and contact messages.',
        icon: Mail,
        path: '/bd6b-6ced/dashboard/enquiries',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
    {
        perm: 'blogs',
        title: 'Blog Articles',
        description: 'Publish luxury brand editorial posts, guides, and recipe content.',
        icon: FileText,
        path: '/bd6b-6ced/dashboard/blogs',
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/20',
    },
    {
        perm: 'clients',
        title: 'Client Directory',
        description: 'View registered customer accounts and order histories.',
        icon: Users,
        path: '/bd6b-6ced/dashboard/clients',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
        perm: 'roles',
        title: 'Role Access (RBAC)',
        description: 'Manage administrative roles and fine-grained module access permissions.',
        icon: ShieldCheck,
        path: '/bd6b-6ced/dashboard/roles',
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
        perm: 'users',
        title: 'Staff User Accounts',
        description: 'Manage administrative staff accounts and role assignments.',
        icon: UserCheck,
        path: '/bd6b-6ced/dashboard/users',
        color: 'text-teal-400',
        bgColor: 'bg-teal-500/10 border-teal-500/20',
    },
];

export default function Dashboard() {
    const isAuth = authUtils.isAuthenticated();
    const { data: userDetailsRes, isLoading: isUserLoading } = useFetchMinimalDetails(isAuth);

    const userDetails = userDetailsRes?.data;
    const userPermissions: string[] | undefined = userDetails?.permissions;
    const userRole = userDetails?.role;
    const assignedRoleName = userDetails?.assigned_role_name;

    // Determine whether user has access to full sales & financial dashboard
    const hasSalesDashboardAccess =
        !userPermissions ||
        userPermissions.length === 0 ||
        userPermissions.includes('dashboard') ||
        (userRole === 'admin' && !assignedRoleName);

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <DashboardLoader text="Loading Workspace..." />
            </div>
        );
    }

    // Render Non-Confidential Operational Dashboard if role lacks sales dashboard permission
    if (!hasSalesDashboardAccess) {
        return (
            <CommonStaffDashboard
                userDetails={userDetails}
                userPermissions={userPermissions || []}
            />
        );
    }

    // Render Full Financial Control Center Dashboard
    return <FullControlCenterDashboard />;
}

// Common Non-Confidential Staff Operational Dashboard
function CommonStaffDashboard({
    userDetails,
    userPermissions,
}: {
    userDetails: any;
    userPermissions: string[];
}) {
    const name = userDetails?.first_name || userDetails?.username || 'Team Member';
    const roleName = userDetails?.assigned_role_name || 'Staff Workspace';

    const permittedCards = ALL_MODULE_CARDS.filter((card) =>
        userPermissions.includes(card.perm)
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-16 max-w-7xl mx-auto"
        >
            {/* Staff Welcome Banner */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#E8BF7A]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8BF7A]/15 border border-[#E8BF7A]/30 rounded-full text-xs font-bold text-[#E8BF7A]">
                            <Shield className="w-3.5 h-3.5" />
                            {roleName}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-bricolage tracking-tight">
                            Welcome back, {name}!
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base font-medium max-w-2xl">
                            Access your permitted operational modules, manage catalog & support requests from your team workspace.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <User className="w-5 h-5 text-[#E8BF7A]" />
                            <div className="text-left">
                                <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                                <p className="text-xs font-bold text-white font-mono">{userDetails?.email || name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Permitted Action Modules */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold font-bricolage text-white flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-[#E8BF7A]" />
                        Permitted Workspace Modules
                    </h2>
                    <span className="text-xs text-gray-400 font-mono">
                        {permittedCards.length} Modules Available
                    </span>
                </div>

                {permittedCards.length === 0 ? (
                    <div className="bg-[#141414] rounded-3xl border border-white/10 p-12 text-center space-y-3">
                        <Shield className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
                        <h3 className="text-lg font-bold text-white">No Modules Assigned Yet</h3>
                        <p className="text-sm text-gray-400 max-w-md mx-auto">
                            Your account role does not have specific operational modules assigned. Please contact your system administrator to update your access permissions.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {permittedCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <Link
                                    key={card.path}
                                    href={card.path}
                                    className="bg-[#141414] rounded-3xl p-6 border border-white/10 hover:border-[#E8BF7A]/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className={`p-3 rounded-2xl border ${card.bgColor}`}>
                                                <Icon className={`w-6 h-6 ${card.color}`} />
                                            </div>
                                            <span className="p-2 rounded-xl bg-white/5 group-hover:bg-[#E8BF7A] text-gray-400 group-hover:text-[#141414] transition duration-300">
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-white font-bricolage group-hover:text-[#E8BF7A] transition">
                                                {card.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#E8BF7A] font-bold">
                                        <span>Open Module</span>
                                        <span className="opacity-0 group-hover:opacity-100 transition">→</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* System Status Banner */}
            <motion.div
                variants={itemVariants}
                className="bg-[#141414] rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">System Security & Workspace Active</p>
                        <p className="text-xs text-gray-400">Role permissions enforced securely by Role-Based Access Control (RBAC).</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Full Financial Control Center Dashboard (Sensitive Sales & Financials)
function FullControlCenterDashboard() {
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
