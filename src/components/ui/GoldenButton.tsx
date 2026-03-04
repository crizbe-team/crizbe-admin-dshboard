'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoldenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
}

export function GoldenButton({
    children,
    isLoading = false,
    loadingText,
    fullWidth = false,
    className,
    disabled,
    ...props
}: GoldenButtonProps) {
    return (
        <button
            className={cn(
                'rounded-[12px] px-7 py-2 text-sm font-semibold text-white cursor-pointer',
                'bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)]',
                'hover:opacity-95 active:opacity-90',
                'focus-visible:ring-2 focus-visible:ring-[#C4994A] focus-visible:ring-offset-2 outline-none',
                'transition disabled:opacity-90 disabled:pointer-events-none',
                'inline-flex items-center justify-center gap-2 min-w-[80px]',
                fullWidth ? 'w-full' : 'w-auto',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden />
                    {loadingText && <span>{loadingText}</span>}
                </>
            ) : (
                children
            )}
        </button>
    );
}

export default GoldenButton;
