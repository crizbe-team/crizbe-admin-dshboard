import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { createPortal } from 'react-dom';

interface DropdownItem {
    id: string;
    name: string;
}

interface SearchableDropdownProps {
    items: DropdownItem[];
    value: string;
    onChange: (item: DropdownItem) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    isLoading?: boolean;
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    className?: string;
    required?: boolean;
}

export default function SearchableDropdown({
    items,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    disabled = false,
    isLoading = false,
    hasNextPage = false,
    fetchNextPage,
    onSearch,
    searchPlaceholder = 'Search...',
    className = '',
    required = false,
}: SearchableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Debounced search
    const debouncedSearch = useDebouncedCallback((query: string) => {
        onSearch?.(query);
    }, 300);

    // Infinite scroll - only enable for dropdown list, not search input
    const { isFetching } = useInfiniteScroll({
        hasNextPage,
        fetchNextPage: () => {
            if (isOpen && !searchQuery) {
                fetchNextPage?.();
            }
        },
        threshold: 100,
    });

    // Calculate dropdown position when opening
    const updateDropdownPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;

            setDropdownPosition({
                top: rect.bottom + scrollY,
                left: rect.left + scrollX,
                width: rect.width,
            });
        }
    };

    // Handle search query change
    useEffect(() => {
        debouncedSearch(searchQuery);
        // Reset highlighted index when search changes
        setHighlightedIndex(-1);
    }, [searchQuery, debouncedSearch]);

    // Find the nearest scrollable parent for portal
    const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
        if (!element) return document.body;

        let parent = element.parentElement;
        while (parent) {
            const style = window.getComputedStyle(parent);
            if (
                style.overflow === 'auto' ||
                style.overflow === 'scroll' ||
                style.overflowY === 'auto' ||
                style.overflowY === 'scroll'
            ) {
                return parent;
            }
            parent = parent.parentElement;
        }

        return document.body;
    };

    // Update position when dropdown opens
    useEffect(() => {
        if (isOpen) {
            updateDropdownPosition();

            // Continuous position updates during scroll
            const handleScroll = () => {
                updateDropdownPosition();
            };

            const scrollableParent = findScrollableParent(buttonRef.current);
            scrollableParent?.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);

            return () => {
                scrollableParent?.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const filteredItems =
                searchQuery && !onSearch
                    ? items.filter((item) =>
                          item.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                    : items;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setHighlightedIndex((prev) => {
                        const nextIndex = prev < filteredItems.length - 1 ? prev + 1 : 0;
                        return nextIndex;
                    });
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setHighlightedIndex((prev) => {
                        const prevIndex = prev > 0 ? prev - 1 : filteredItems.length - 1;
                        return prevIndex;
                    });
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
                        const selectedItem = filteredItems[highlightedIndex];
                        handleSelect(selectedItem);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    setIsOpen(false);
                    setHighlightedIndex(-1);
                    break;
                case 'Tab':
                    e.preventDefault();
                    if (e.shiftKey) {
                        // Shift+Tab: move up
                        setHighlightedIndex((prev) => {
                            const prevIndex = prev > 0 ? prev - 1 : filteredItems.length - 1;
                            return prevIndex;
                        });
                    } else {
                        // Tab: move down
                        setHighlightedIndex((prev) => {
                            const nextIndex = prev < filteredItems.length - 1 ? prev + 1 : 0;
                            return nextIndex;
                        });
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, items, searchQuery, onSearch]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex]);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Handle item selection
    const handleSelect = (item: DropdownItem) => {
        onChange(item);
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
    };

    // Get display text
    const displayText = value || placeholder;

    // Filter items based on search query (for local filtering when API search is not available)
    const filteredItems =
        searchQuery && !onSearch
            ? items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : items;

    const dropdownContent = (
        <div
            ref={listRef}
            className="fixed z-[9999] bg-white rounded-lg border border-[#E7E4DD] shadow-lg py-1 max-h-[200px] overflow-y-auto"
            style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
            }}
        >
            {/* Search input */}
            {onSearch && (
                <div className="px-3 py-2 border-b border-[#E7E4DD]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B635A]" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-[#E7E4DD] rounded-lg outline-none focus:border-[#C4994A] placeholder:text-[#B7AFA5]"
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {/* Items list */}
            <div>
                {filteredItems.length === 0 && !isLoading ? (
                    <div className="px-3 py-4 text-center text-sm text-[#6B635A]">
                        No items found
                    </div>
                ) : (
                    <>
                        {filteredItems.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelect(item)}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-[#F5F3F0] transition-colors ${
                                    value === item.name
                                        ? 'bg-[#F5F3F0] text-[#4E3325] font-medium'
                                        : 'text-[#4E3325]'
                                } ${
                                    highlightedIndex === index
                                        ? 'bg-[#F5F3F0] text-[#4E3325] font-medium'
                                        : ''
                                }`}
                                role="option"
                                aria-selected={value === item.name}
                            >
                                {item.name}
                            </button>
                        ))}

                        {/* Loading indicator for infinite scroll */}
                        {(isLoading || isFetching) && filteredItems.length > 0 && (
                            <div className="px-3 py-2 flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-[#6B635A]" />
                                <span className="ml-2 text-sm text-[#6B635A]">Loading...</span>
                            </div>
                        )}

                        {/* No more items indicator */}
                        {!hasNextPage && filteredItems.length > 0 && !isLoading && !isFetching && (
                            <div className="px-3 py-2 text-center text-xs text-[#6B635A]">
                                No more items
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="text-xs font-medium text-[#404040]">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <button
                ref={buttonRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`mt-1 w-full flex items-center justify-between rounded-lg border border-[#E7E4DD] bg-white px-3 py-2 text-sm text-left outline-none hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors disabled:opacity-50 ${
                    isOpen ? 'border-[#C4994A]' : ''
                }`}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-required={required}
            >
                {isLoading && !isOpen ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#6B635A]" />
                ) : (
                    <span className={value ? 'text-[#4E3325]' : 'text-[#B7AFA5]'}>
                        {displayText}
                    </span>
                )}
                <ChevronDown
                    className={`w-4 h-4 text-[#6B635A] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Render dropdown using portal to escape container constraints */}
            {isOpen &&
                typeof window !== 'undefined' &&
                createPortal(
                    dropdownContent,
                    findScrollableParent(dropdownRef.current) || document.body
                )}
        </div>
    );
}
