'use client';

import { Loader2 } from 'lucide-react';

interface DashboardLoaderProps {
    text?: string;
    subtext?: string;
}

export default function DashboardLoader({
    text = 'Loading data',
    subtext = 'Please wait while we fetch the latest information...',
}: DashboardLoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400 min-h-[350px]">
            <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-[#E8BF7A]" />
                <div className="absolute inset-0 blur-xl bg-[#E8BF7A]/25 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col items-center space-y-1">
                <p className="text-xl font-extrabold text-white font-bricolage animate-pulse tracking-tight">
                    {text}
                </p>
                <p className="text-xs font-medium text-gray-400">{subtext}</p>
            </div>
            {/* Subtle skeleton hint */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6 max-w-4xl px-4 opacity-15">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-[#141414] rounded-2xl p-6 border border-white/10 h-16 animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}
