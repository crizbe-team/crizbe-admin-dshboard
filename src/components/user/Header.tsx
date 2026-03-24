'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ChevronDown, ChevronRight, ShoppingCart, User } from 'lucide-react';
import AuthActionWrapper from '@/components/AuthActionWrapper';
import { authUtils } from '@/utils/auth';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { useOutsideClick } from '@/hooks/use-outside-click';

export default function Header() {
    const { currency, setCurrency, isLoading } = useCurrency();
    const pathname = usePathname();
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const currencyRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

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
    }, []);

    useOutsideClick({
        ref: currencyRef as any,
        callback: () => setIsCurrencyOpen(false),
    });

    useOutsideClick({
        ref: profileRef as any,
        callback: () => setIsProfileOpen(false),
    });

    const isCartActive = pathname === '/cart';
    const isProfileActive = pathname.startsWith('/profile');
    const isProfilePage = pathname === '/profile';
    const isOrdersPage = pathname === '/profile/my-orders';

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
                    <div className="relative" ref={currencyRef}>
                        <button
                            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 transition-all duration-200 text-white"
                        >
                            <span className="font-medium">{currentCurrency.symbol}</span>
                            <span className="text-sm">{currentCurrency.code}</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    isCurrencyOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {isCurrencyOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                                {currencies.map((curr) => (
                                    <button
                                        key={curr.code}
                                        onClick={() => {
                                            setCurrency(curr.code);
                                            setIsCurrencyOpen(false);
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
                                className={`relative flex h-[44px] w-[44px] items-center justify-center rounded-full transition-all duration-300 ${
                                    isCartActive
                                        ? 'bg-white text-[#4E3325] shadow-lg scale-110'
                                        : 'bg-white/15 hover:bg-white text-[#4E3325] hover:shadow-lg hover:scale-110'
                                }`}
                                aria-label="Cart"
                            >
                                <ShoppingCart className="w-[22px] h-[22px]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex min-w-[20px] h-[20px] items-center justify-center rounded-full bg-[#E8BF7A] text-[10px] font-bold text-white px-1 shadow-sm border-2 border-white">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        </AuthActionWrapper>

                        <div className="relative" ref={profileRef}>
                            <AuthActionWrapper>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex h-[44px] w-[44px] items-center justify-center rounded-full transition-all duration-300 ${
                                        isProfileActive || isProfileOpen
                                            ? 'bg-white text-[#4E3325] shadow-lg scale-110'
                                            : 'bg-white/15 hover:bg-white text-[#4E3325] hover:shadow-lg hover:scale-110'
                                    }`}
                                    aria-label="Profile"
                                >
                                    <User className="w-[22px] h-[22px]" />
                                </button>
                            </AuthActionWrapper>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-4 w-[280px] bg-white rounded-[24px] shadow-2xl p-4 z-50 animate-in fade-in zoom-in duration-200">
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className={`flex items-center justify-between w-full h-[52px] rounded-[16px] px-5 py-3 transition-all group ${
                                                isProfilePage
                                                    ? 'bg-[#4E3325] text-white shadow-md'
                                                    : 'bg-gray-50 text-[#1A1A1A] hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="text-[17px] font-medium font-inter-tight">
                                                Go to profile
                                            </span>
                                            <ChevronRight
                                                className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                                                    isProfilePage ? 'text-white' : 'text-[#A4A7AE]'
                                                }`}
                                            />
                                        </Link>
                                        <Link
                                            href="/profile/my-orders"
                                            onClick={() => setIsProfileOpen(false)}
                                            className={`flex items-center justify-between w-full h-[52px] rounded-[16px] px-5 py-3 transition-all group ${
                                                isOrdersPage
                                                    ? 'bg-[#4E3325] text-white shadow-md'
                                                    : 'bg-white text-[#1A1A1A] hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-[17px] font-medium font-inter-tight">
                                                My orders
                                            </span>
                                            {isOrdersPage && (
                                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-white" />
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menu icon */}
                    <button
                        className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/15 hover:bg-white transition-all duration-300 hover:shadow-lg hover:scale-110 group"
                        aria-label="Open menu"
                    >
                        <div className="flex h-[10px] w-[24px] flex-col justify-between">
                            <span className="h-[2.5px] w-full rounded bg-[#4E3325]"></span>
                            <span className="h-[2.5px] w-full rounded bg-[#4E3325]"></span>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
