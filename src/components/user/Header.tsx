'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ChevronDown, ShoppingCart, User } from 'lucide-react';
import AuthActionWrapper from '@/components/AuthActionWrapper';
import { authUtils } from '@/utils/auth';
import { useFetchMinimalDetails } from '@/queries/use-account';

export default function Header() {
    const { currency, setCurrency, isLoading } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: minimalDetailsRes } = useFetchMinimalDetails(isAuth);
    const cartCount = minimalDetailsRes?.data?.cart_count || 0;

    const currencies = [
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
    ];

    const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0];

    useEffect(() => {
        setIsAuth(authUtils.isAuthenticated());

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="fixed  top-0 left-0 right-0 z-50 w-full h-[80px] backdrop-blur-md bg-white/10 border-b border-white/20">
            <div className="mx-auto wrapper flex h-full max-w-7xl items-center justify-between ">
                <h1 className="text-lg font-semibold text-white w-[150px]">
                    <Link href="/">
                        <Image
                            src="/images/user/crizbe-logo.svg"
                            alt="Logo"
                            width={200}
                            height={100}
                            priority
                            quality={100}
                        />
                    </Link>
                </h1>

                {/* Right side actions */}
                <div className="flex items-center gap-6">
                    {/* Currency Switcher */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 transition-all duration-200 text-white"
                        >
                            <span className="font-medium">{currentCurrency.symbol}</span>
                            <span className="text-sm">{currentCurrency.code}</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    isOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                                {currencies.map((curr) => (
                                    <button
                                        key={curr.code}
                                        onClick={() => {
                                            setCurrency(curr.code);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${
                                            currency === curr.code
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{curr.symbol}</span>
                                            <div>
                                                <div className="font-medium">{curr.code}</div>
                                                <div className="text-xs text-gray-500">
                                                    {curr.name}
                                                </div>
                                            </div>
                                        </div>
                                        {currency === curr.code && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart & Profile */}
                    <div className="flex items-center gap-4">
                        <AuthActionWrapper>
                            <Link
                                href="/cart"
                                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-[#4E3325] transition-colors"
                                aria-label="Cart"
                            >
                                <ShoppingCart className="w-[24px] h-[24px]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#E8BF7A] text-[10px] font-bold text-white px-1 shadow-sm">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        </AuthActionWrapper>
                        <AuthActionWrapper>
                            <Link
                                href="/profile"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-[#4E3325] transition-colors"
                                aria-label="Profile"
                            >
                                <User className="w-[24px] h-[24px]" />
                            </Link>
                        </AuthActionWrapper>
                    </div>

                    {/* Menu icon */}
                    <button
                        className="flex h-[10px] w-[32px] flex-col justify-between cursor-pointer"
                        aria-label="Open menu"
                    >
                        <span className="h-[3px] w-full rounded bg-[#4E3325]"></span>
                        <span className="h-[3px] w-full rounded bg-[#4E3325]"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
