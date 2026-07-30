'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface DebouncedSearchProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    delay?: number;
    initialValue?: string;
    className?: string;
}

export default function DebouncedSearch({
    onSearch,
    placeholder = 'Search...',
    delay = 500,
    initialValue = '',
    className = '',
}: DebouncedSearchProps) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay, onSearch]);

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#E8BF7A]" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-[#1a1a1a] text-white text-sm font-medium pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#E8BF7A] transition w-full placeholder:text-gray-500"
            />
        </div>
    );
}
