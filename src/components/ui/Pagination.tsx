import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNext: boolean;
    hasPrevious: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    hasNext,
    hasPrevious,
}) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                        currentPage === i
                            ? 'bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] shadow-lg shadow-[#E8BF7A]/20'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 py-4">
            <button
                onClick={() => onPageChange(1)}
                disabled={!hasPrevious}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#E8BF7A]/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="First Page"
            >
                <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#E8BF7A]/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Previous Page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">{renderPageNumbers()}</div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#E8BF7A]/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Next Page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={!hasNext}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#E8BF7A]/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Last Page"
            >
                <ChevronsRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;
