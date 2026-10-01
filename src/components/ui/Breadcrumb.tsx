import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface BreadcrumbItem {
    label: React.ReactNode;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex flex-wrap items-center text-sm text-[#595959] gap-y-1">
            {items.map((item, index) => (
                <div key={index} className="flex items-center min-w-0">
                    {index > 0 && <span className="mx-2 text-xs shrink-0 select-none">/</span>}
                    {item.href ? (
                        <Link href={item.href} className="hover:text-[#1A1A1A] font-medium transition-all duration-200 shrink-0">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-[#1A1A1A] min-w-0 inline-block max-w-full truncate">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;