'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-dashed border-[#EAEAEA] py-4">
            <button
                className="flex items-center justify-between w-full text-left focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-[#1A1A1A] group-hover:text-amber-700 transition-colors">
                    {title}
                </span>
                {isOpen ? (
                    <Minus className="w-5 h-5 text-[#1A1A1A]" />
                ) : (
                    <Plus className="w-5 h-5 text-[#1A1A1A]" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? ' opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="text-[#5A5A5A] leading-relaxed pb-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccordionItem;
