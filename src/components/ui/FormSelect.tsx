'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/use-debounce';

type Option = {
    id: string;
    name: string;
};

interface FormSelectProps {
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string; // wrapper
    triggerClassName?: string; // for trigger override
    error?: string;
    enableSearch?: boolean;
    searchPlaceholder?: string;
    onSearchChange?: (query: string) => void;
}

export function FormSelect({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    required,
    disabled,
    className,
    triggerClassName,
    error,
    enableSearch = false,
    searchPlaceholder = 'Search...',
    onSearchChange,
}: FormSelectProps) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const debouncedSearch = useDebouncedCallback((query: string) => {
        onSearchChange?.(query);
    }, 500);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        debouncedSearch(query);
    };

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            {label && (
                <label className="text-xs font-medium text-[#404040]">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger
                    className={cn(
                        'mt-1 w-full justify-between rounded-lg border border-[#E7E4DD] bg-white px-3 py-2 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors disabled:opacity-50',
                        triggerClassName
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent
                    position="popper"
                    className="max-h-[300px] w-(--radix-select-trigger-width)"
                >
                    {enableSearch && (
                        <div className="px-3 py-2 border-b border-[#E7E4DD] sticky top-0 bg-white z-10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B635A]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    placeholder={searchPlaceholder}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E7E4DD] rounded-lg outline-none focus:border-[#C4994A] placeholder:text-[#B7AFA5]"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    <div className="overflow-y-auto">
                        {options.length > 0 ? (
                            options.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.name}
                                </SelectItem>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-[#6B635A]">
                                No options found
                            </div>
                        )}
                    </div>
                </SelectContent>
            </Select>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default FormSelect;
