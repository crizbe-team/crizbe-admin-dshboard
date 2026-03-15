'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface AccordionItemProps {
    title: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const isRatingsSection =
        typeof title === 'string'
            ? title === 'Ratings & Reviews'
            : React.isValidElement<{ children?: React.ReactNode }>(title) &&
            title.props.children === 'Ratings & Reviews';

    return (
        <div className={isRatingsSection ? 'py-[24px]' : 'border-b  border-dashed border-[#CEA663] py-[24px] '}>
            <button
                className="flex items-center justify-between w-full text-left focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-[#1A1A1A] transition-colors">
                    {title}
                </span>
                {isOpen ? (
                    <Minus className="w-5 h-5 text-[#1A1A1A]" />
                ) : (
                    <Plus className="w-5 h-5 text-[#1A1A1A]" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? ' opacity-100 mt-[22px]' : 'max-h-0 opacity-0'
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
