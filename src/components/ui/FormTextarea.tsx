'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    wrapperClassName?: string;
    labelClassName?: string;
    required?: boolean;
    error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, wrapperClassName, labelClassName, required, className, error, ...props }, ref) => {
        return (
            <div className={cn('flex flex-col ', wrapperClassName)}>
                <label className={cn('text-xs font-medium text-[#404040]', labelClassName)}>
                    {label}
                    {required && <span className="text-[#002D62] ml-1">*</span>}
                </label>
                <textarea
                    ref={ref}
                    className={cn(
                        'mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors resize-none',
                        error ? 'border-red-500' : 'border-[#E9EAEB]',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs mt-[6px] text-red-500">{error}</p>}
            </div>
        );
    }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
