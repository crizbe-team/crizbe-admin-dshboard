'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
    name: string;
    control: any;
    label?: string;
    className?: string;
    error?: any;
}

interface InputProps
    extends BaseFieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {}
interface TextareaProps
    extends BaseFieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {}
interface CheckboxProps
    extends BaseFieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {}

export const DashboardInput = ({ name, control, label, className, ...props }: InputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                    {label && (
                        <label
                            htmlFor={name}
                            className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5"
                        >
                            {label}
                        </label>
                    )}
                    <input
                        {...field}
                        id={name}
                        className={cn(
                            'w-full bg-white/5 text-white px-4 py-2.5 rounded-xl border focus:outline-none transition-colors text-sm placeholder:text-gray-500',
                            error ? 'border-rose-500' : 'border-white/10 focus:border-[#E8BF7A]',
                            className
                        )}
                        {...props}
                    />
                    {error && <p className="mt-1 text-xs font-semibold text-rose-400">{error.message}</p>}
                </div>
            )}
        />
    );
};

export const DashboardTextarea = ({
    name,
    control,
    label,
    className,
    rows = 4,
    ...props
}: TextareaProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                    {label && (
                        <label
                            htmlFor={name}
                            className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5"
                        >
                            {label}
                        </label>
                    )}
                    <textarea
                        {...field}
                        id={name}
                        rows={rows}
                        className={cn(
                            'w-full bg-white/5 text-white px-4 py-2.5 rounded-xl border focus:outline-none transition-colors text-sm placeholder:text-gray-500',
                            error ? 'border-rose-500' : 'border-white/10 focus:border-[#E8BF7A]',
                            className
                        )}
                        {...props}
                    />
                    {error && <p className="mt-1 text-xs font-semibold text-rose-400">{error.message}</p>}
                </div>
            )}
        />
    );
};

export const DashboardCheckbox = ({ name, control, label, className, ...props }: CheckboxProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id={name}
                            checked={value}
                            onChange={(e) => onChange(e.target.checked)}
                            {...field}
                            className={cn(
                                'w-4 h-4 rounded border-white/10 bg-white/5 text-[#E8BF7A] accent-[#E8BF7A] focus:ring-0 cursor-pointer',
                                className
                            )}
                            {...props}
                        />
                        {label && (
                            <label
                                htmlFor={name}
                                className="text-sm font-semibold text-gray-300 cursor-pointer"
                            >
                                {label}
                            </label>
                        )}
                    </div>
                    {error && <p className="text-xs font-semibold text-rose-400">{error.message}</p>}
                </div>
            )}
        />
    );
};

export const DashboardSelect = ({ name, control, label, className, children, ...props }: any) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full">
                    {label && (
                        <label
                            htmlFor={name}
                            className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5"
                        >
                            {label}
                        </label>
                    )}
                    <select
                        {...field}
                        id={name}
                        className={cn(
                            'w-full bg-[#141414] text-white px-4 py-2.5 rounded-xl border focus:outline-none transition-colors text-sm font-semibold cursor-pointer',
                            error ? 'border-rose-500' : 'border-white/10 focus:border-[#E8BF7A]',
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </select>
                    {error && <p className="mt-1 text-xs font-semibold text-rose-400">{error.message}</p>}
                </div>
            )}
        />
    );
};
