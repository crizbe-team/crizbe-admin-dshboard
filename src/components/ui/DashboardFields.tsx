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
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            {label}
                        </label>
                    )}
                    <input
                        {...field}
                        id={name}
                        className={cn(
                            'w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border focus:outline-none transition-colors',
                            error ? 'border-red-500' : 'border-[#3a3a3a] focus:border-purple-500',
                            className
                        )}
                        {...props}
                    />
                    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
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
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            {label}
                        </label>
                    )}
                    <textarea
                        {...field}
                        id={name}
                        rows={rows}
                        className={cn(
                            'w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border focus:outline-none transition-colors',
                            error ? 'border-red-500' : 'border-[#3a3a3a] focus:border-purple-500',
                            className
                        )}
                        {...props}
                    />
                    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
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
                                'w-4 h-4 rounded border-gray-600 bg-[#2a2a2a] text-purple-600 focus:ring-purple-500 cursor-pointer',
                                className
                            )}
                            {...props}
                        />
                        {label && (
                            <label
                                htmlFor={name}
                                className="text-sm font-medium text-gray-300 cursor-pointer"
                            >
                                {label}
                            </label>
                        )}
                    </div>
                    {error && <p className="text-xs text-red-500">{error.message}</p>}
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
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            {label}
                        </label>
                    )}
                    <select
                        {...field}
                        id={name}
                        className={cn(
                            'w-full bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border focus:outline-none transition-colors appearance-none',
                            error ? 'border-red-500' : 'border-[#3a3a3a] focus:border-purple-500',
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </select>
                    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
                </div>
            )}
        />
    );
};
