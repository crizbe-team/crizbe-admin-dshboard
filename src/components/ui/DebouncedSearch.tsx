'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-[#2a2a2a] text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-purple-500 w-full"
            />
        </div>
    );
}
