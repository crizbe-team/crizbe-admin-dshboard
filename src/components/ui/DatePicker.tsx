'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOutsideClick } from '@/hooks/use-outside-click';

interface DatePickerProps {
    label?: string;
    value?: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    minDate?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePicker: React.FC<DatePickerProps> = ({
    label,
    value = '',
    onChange,
    minDate,
    placeholder = 'Select date',
    error,
    required,
    wrapperClassName,
    labelClassName,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    useOutsideClick({
        ref: popupRef as any,
        callback: () => setIsOpen(false),
    });

    // Update floating coords whenever opened or scrolled/resized
    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const popupWidth = 256; // 64 * 4 = 256px
            const popupHeight = 270;

            let top = rect.bottom + 6;
            // If near bottom of viewport, pop above
            if (rect.bottom + popupHeight > window.innerHeight) {
                top = rect.top - popupHeight - 6;
            }

            // Right-align with trigger box
            let left = rect.right - popupWidth;
            if (left < 16) left = rect.left;

            setCoords({ top, left });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
        }
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen]);

    // Parse selected date
    const selectedDate = value ? new Date(value + 'T00:00:00') : null;

    // View state for current calendar page
    const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const handlePrevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleSelectDay = (day: number) => {
        const formattedMonth = String(currentMonth + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const dateString = `${currentYear}-${formattedMonth}-${formattedDay}`;
        onChange(dateString);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    const formattedDisplayDate = selectedDate
        ? selectedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : '';

    // Check if day is disabled (before minDate)
    const isDayDisabled = (day: number) => {
        if (!minDate) return false;
        const target = new Date(currentYear, currentMonth, day);
        const min = new Date(minDate + 'T00:00:00');
        min.setHours(0, 0, 0, 0);
        return target < min;
    };

    return (
        <div className={cn('flex flex-col relative', wrapperClassName)}>
            {label && (
                <label className={cn('text-xs font-medium text-[#404040] mb-1', labelClassName)}>
                    {label}
                    {required && <span className="text-[#002D62] ml-1">*</span>}
                </label>
            )}

            {/* Trigger Button */}
            <div
                ref={triggerRef}
                onClick={() => {
                    updatePosition();
                    setIsOpen(!isOpen);
                }}
                className={cn(
                    'w-full rounded-md border bg-white px-3 py-2 text-sm text-[#4E3325] outline-none cursor-pointer flex items-center justify-between transition-colors',
                    error ? 'border-red-500' : 'border-[#E9EAEB] hover:border-[#C4994A] focus:border-[#C4994A]',
                    isOpen && 'border-[#C4994A] ring-1 ring-[#C4994A]'
                )}
            >
                <span className={cn(formattedDisplayDate ? 'font-medium text-[#4E3325]' : 'text-[#B7AFA5]')}>
                    {formattedDisplayDate || placeholder}
                </span>

                <div className="flex items-center gap-1.5 text-[#4E3325]">
                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <CalendarIcon className="w-4 h-4 text-[#9A7236]" />
                </div>
            </div>

            {error && <p className="text-xs mt-[6px] text-red-500">{error}</p>}

            {/* Portal-rendered Calendar Popup (Rendered on document.body, avoiding overflow clipping) */}
            {mounted && isOpen && createPortal(
                <div
                    ref={popupRef}
                    style={{
                        position: 'fixed',
                        top: `${coords.top}px`,
                        left: `${coords.left}px`,
                        zIndex: 999999,
                    }}
                    className="w-64 bg-white rounded-2xl shadow-2xl border border-[#C4994A]/40 p-3.5 animate-in fade-in zoom-in-95 duration-150"
                >
                    {/* Month / Year Header Navigation */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E7E4DD]">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 hover:bg-[#FAF4E6] text-[#4E3325] rounded-lg transition"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="text-xs font-bold font-bricolage text-[#4E3325]">
                            {MONTHS[currentMonth]} {currentYear}
                        </span>

                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-[#FAF4E6] text-[#4E3325] rounded-lg transition"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 text-center mb-1">
                        {DAYS_OF_WEEK.map((d) => (
                            <span key={d} className="text-[10px] font-bold text-[#9A7236]">
                                {d}
                            </span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {/* Empty padding slots for days before 1st of month */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {/* Days of month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isSelected =
                                selectedDate &&
                                selectedDate.getFullYear() === currentYear &&
                                selectedDate.getMonth() === currentMonth &&
                                selectedDate.getDate() === day;
                            const disabled = isDayDisabled(day);

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => handleSelectDay(day)}
                                    className={cn(
                                        'h-6 w-6 rounded-full text-[11px] font-semibold flex items-center justify-center transition-all mx-auto',
                                        disabled && 'text-gray-300 cursor-not-allowed hover:bg-transparent',
                                        !disabled && !isSelected && 'text-[#4E3325] hover:bg-[#FAF4E6] hover:text-[#9A7236]',
                                        isSelected && 'bg-[#4E3325] text-[#E8BF7A] font-bold shadow-md'
                                    )}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Today Shortcut Button */}
                    <div className="pt-2 mt-2 border-t border-[#E7E4DD] flex items-center justify-between text-xs">
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date();
                                const formattedMonth = String(today.getMonth() + 1).padStart(2, '0');
                                const formattedDay = String(today.getDate()).padStart(2, '0');
                                onChange(`${today.getFullYear()}-${formattedMonth}-${formattedDay}`);
                                setIsOpen(false);
                            }}
                            className="text-[#9A7236] font-bold hover:underline text-[11px]"
                        >
                            Select Today
                        </button>
                        {value && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('');
                                    setIsOpen(false);
                                }}
                                className="text-gray-400 hover:text-gray-600 text-[11px]"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default DatePicker;
