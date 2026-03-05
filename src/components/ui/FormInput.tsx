'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    wrapperClassName?: string;
    labelClassName?: string;
    required?: boolean;
    error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, wrapperClassName, labelClassName, required, className, error, ...props }, ref) => {
        return (
            <div className={cn('flex flex-col mb-[16px]', wrapperClassName)}>
                <label className={cn('text-xs font-medium text-[#404040]', labelClassName)}>
                    {label}
                    {required && <span className="text-[#002D62] ml-1">*</span>}
                </label>
                <input
                    ref={ref}
                    className={cn(
                        'mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors',
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

FormInput.displayName = 'FormInput';

export default FormInput;
