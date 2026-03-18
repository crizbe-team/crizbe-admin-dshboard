'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useDebouncedCallback } from '@/hooks/use-debounce';

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    onSearchChange?: (query: string) => void;
    placeholder?: string;
    className?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    onSearchChange,
    placeholder = 'Select option...',
    className = '',
    isDisabled = false,
    isLoading = false,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const debouncedSearchChange = useDebouncedCallback((query: string) => {
        onSearchChange?.(query);
    }, 500);

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearchChange) {
            debouncedSearchChange(query);
        }
    };

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = onSearchChange
        ? options
        : options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string) => {
        if (isDisabled) return;
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div
            className={`relative ${className} ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            ref={containerRef}
        >
            <div
                onClick={() => !isDisabled && setIsOpen(!isOpen)}
                className={`bg-[#2a2a2a] text-gray-100 px-4 py-2 rounded-lg border border-[#3a3a3a] flex items-center justify-between ${isDisabled ? '' : 'cursor-pointer hover:border-purple-500'} transition-colors`}
            >
                <span className={selectedOption ? 'text-gray-100' : 'text-gray-400'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-[#2a2a2a]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                placeholder="Search..."
                                className="w-full bg-[#2a2a2a] text-gray-100 pl-9 pr-4 py-2 rounded-md border border-[#3a3a3a] focus:outline-none focus:border-purple-500 text-sm"
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 flex flex-col items-center justify-center gap-2 text-gray-400">
                                <Search className="w-5 h-5 animate-pulse text-purple-500" />
                                <span className="text-xs">Finding options...</span>
                            </div>
                        ) : filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer text-sm transition-colors ${
                                        option.value === value
                                            ? 'text-purple-400 bg-[#2a2a2a]'
                                            : 'text-gray-300'
                                    }`}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
