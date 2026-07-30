'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface OrderStatusData {
    completed?: number;
    pending?: number;
    canceled?: number;
}

export default function OrderStatusChart({ data = { completed: 0, pending: 0, canceled: 0 } }: { data?: OrderStatusData }) {
    const completedCount = Number(data?.completed) || 0;
    const pendingCount = Number(data?.pending) || 0;
    const canceledCount = Number(data?.canceled) || 0;

    const orderStatuses = [
        {
            status: 'Completed',
            count: completedCount,
            icon: CheckCircle2,
            gradient: 'from-emerald-500 to-teal-400',
            textColor: 'text-emerald-400',
            badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        },
        {
            status: 'Pending',
            count: pendingCount,
            icon: Clock,
            gradient: 'from-[#E8BF7A] to-[#C4994A]',
            textColor: 'text-[#E8BF7A]',
            badgeBg: 'bg-[#E8BF7A]/10 border-[#E8BF7A]/20 text-[#E8BF7A]',
        },
        {
            status: 'Canceled',
            count: canceledCount,
            icon: XCircle,
            gradient: 'from-rose-500 to-red-400',
            textColor: 'text-rose-400',
            badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        },
    ];

    const total = orderStatuses.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="space-y-4 py-1">
            {orderStatuses.map((item) => {
                const Icon = item.icon;
                const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                return (
                    <div key={item.status} className="bg-white/5 border border-white/5 rounded-2xl p-3.5 space-y-2.5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2.5">
                                <Icon className={`w-4 h-4 ${item.textColor}`} />
                                <span className="text-xs font-semibold text-gray-200">{item.status}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg border ${item.badgeBg}`}>
                                    {percentage}%
                                </span>
                                <span className="text-xs font-bold text-white font-mono min-w-[28px] text-right">
                                    {item.count.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700 ease-out`}
                                style={{ width: `${Math.max(Number(percentage), item.count > 0 ? 4 : 0)}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
