'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Loader2 } from 'lucide-react';
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
                className={`bg-[#1a1a1a] text-white text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/10 flex items-center justify-between ${isDisabled ? '' : 'cursor-pointer hover:border-[#E8BF7A]/50'} transition-all`}
            >
                <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-[#E8BF7A] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-white/10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#E8BF7A]" />
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                placeholder="Search..."
                                className="w-full bg-white/5 text-white pl-9 pr-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#E8BF7A] text-xs font-medium"
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {isLoading ? (
                            <div className="p-4 flex flex-col items-center justify-center gap-2 text-gray-400">
                                <Loader2 className="w-5 h-5 animate-spin text-[#E8BF7A]" />
                                <span className="text-xs font-semibold">Finding options...</span>
                            </div>
                        ) : filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all ${
                                        option.value === value
                                            ? 'text-[#E8BF7A] bg-[#E8BF7A]/10 border border-[#E8BF7A]/20'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-xs text-gray-400 text-center font-medium">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
