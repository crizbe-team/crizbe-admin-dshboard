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
                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        currentPage === i
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                            : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333333] hover:text-white border border-[#3a3a3a]'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 py-6">
            <button
                onClick={() => onPageChange(1)}
                disabled={!hasPrevious}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-500 hover:text-white hover:border-[#3a3a3a] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="First Page"
            >
                <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-500 hover:text-white hover:border-[#3a3a3a] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Previous Page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">{renderPageNumbers()}</div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-500 hover:text-white hover:border-[#3a3a3a] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Next Page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={!hasNext}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-500 hover:text-white hover:border-[#3a3a3a] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Last Page"
            >
                <ChevronsRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
