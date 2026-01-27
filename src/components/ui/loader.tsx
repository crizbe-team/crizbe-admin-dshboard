import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoaderProps {
    className?: string;
    text?: string;
}

export default function Loader({ className = '', text = 'Loading...' }: LoaderProps) {
    return (
        <div
            className={`flex min-h-[400px] w-full flex-col items-center justify-center gap-3 ${className}`}
        >
            <div className="relative flex items-center justify-center">
                <div className="absolute h-12 w-12 animate-ping rounded-full bg-purple-500/20"></div>
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
            <p className="animate-pulse text-sm font-medium text-gray-400">{text}</p>
        </div>
    );
}
