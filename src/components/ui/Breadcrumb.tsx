import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex items-center text-sm text-[#8E8E8E] mb-8">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-xs">/</span>}
                    {item.href ? (
                        <Link href={item.href} className="hover:text-[#1A1A1A] transition-all duration-200">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-bold text-[#1A1A1A]">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
