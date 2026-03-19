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
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400 min-h-[400px]">
            <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                <div className="absolute inset-0 blur-xl bg-purple-600/20 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col items-center space-y-1">
                <p className="text-xl font-medium text-gray-100 animate-pulse tracking-wide">
                    {text}
                </p>
                <p className="text-sm text-gray-500 italic">{subtext}</p>
            </div>
            {/* Subtle structure skeleton hint */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-8 max-w-4xl px-4 opacity-10">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] h-20 animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}
