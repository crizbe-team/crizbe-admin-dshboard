'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, ShoppingCart, User, Gift } from 'lucide-react';
import AuthActionWrapper from '@/components/AuthActionWrapper';
import { authUtils } from '@/utils/auth';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { useOutsideClick } from '@/hooks/use-outside-click';
import NavigationMenu from './NavigationMenu';
import PreOrderModal from '@/components/PreOrder/PreOrderModal';

export default function Header() {
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const { data: minimalDetailsRes } = useFetchMinimalDetails(isAuth);
    const cartCount = minimalDetailsRes?.data?.cart_count || 0;

    useEffect(() => {
        setIsAuth(authUtils.isAuthenticated());
    }, []);

    useOutsideClick({
        ref: profileRef as any,
        callback: () => setIsProfileOpen(false),
    });

    const isCartActive = pathname === '/checkout/cart';
    const isProfileActive = pathname.startsWith('/profile');
    const isProfilePage = pathname === '/profile';
    const isOrdersPage = pathname === '/profile/my-orders';

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 w-full h-[80px] backdrop-blur-md">
                <div className="mx-auto wrapper flex h-full max-w-7xl items-center justify-between">
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
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Pre-Order / Corporate Gifting Button */}
                        <button
                            onClick={() => setIsPreOrderOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-[#E8BF7A] hover:bg-[#d4ac68] text-[#141414] font-bold text-xs rounded-full transition-all duration-300 shadow-md hover:scale-105"
                        >
                            <Gift className="w-3.5 h-3.5 text-[#141414]" />
                            <span>Pre-Order</span>
                        </button>

                        {/* Cart & Profile */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            <AuthActionWrapper>
                                <Link
                                    href="/checkout/cart"
                                    className={`relative flex h-[44px] w-[44px] items-center justify-center rounded-full transition-all duration-300 ${isCartActive ? 'bg-white text-[#4E3325] shadow-lg scale-110' : 'bg-white/15 hover:bg-white text-[#4E3325] hover:shadow-lg hover:scale-110'}`}
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
                                        className={`flex h-[44px] w-[44px] items-center justify-center rounded-full transition-all duration-300 ${isProfileActive || isProfileOpen ? 'bg-white text-[#4E3325] shadow-lg scale-110' : 'bg-white/15 hover:bg-white text-[#4E3325] hover:shadow-lg hover:scale-110'}`}
                                        aria-label="Profile"
                                    >
                                        <User className="w-[22px] h-[22px]" />
                                    </button>
                                </AuthActionWrapper>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-4 w-[280px] bg-white rounded-[32px] shadow-2xl p-4 z-50 animate-in fade-in zoom-in duration-200">
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsProfileOpen(false)}
                                                className={`flex items-center justify-between w-full h-[52px] rounded-[16px] px-5 py-3 transition-all group ${isProfilePage ? 'bg-[#4E3325] text-white shadow-md' : 'bg-gray-50 text-[#1A1A1A] hover:bg-gray-100'}`}
                                            >
                                                <span className="text-[17px] font-medium font-inter-tight">
                                                    Go to profile
                                                </span>
                                                <ChevronRight
                                                    className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isProfilePage ? 'text-white' : 'text-[#A4A7AE]'}`}
                                                />
                                            </Link>
                                            <Link
                                                href="/profile/my-orders"
                                                onClick={() => setIsProfileOpen(false)}
                                                className={`flex items-center justify-between w-full h-[52px] rounded-[16px] px-5 py-3 transition-all group ${isOrdersPage ? 'bg-[#4E3325] text-white shadow-md' : 'bg-white text-[#1A1A1A] hover:bg-gray-50'}`}
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
                            onClick={() => setIsMenuOpen(true)}
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

            <NavigationMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onOpenPreOrder={() => setIsPreOrderOpen(true)}
            />

            <PreOrderModal open={isPreOrderOpen} onClose={() => setIsPreOrderOpen(false)} />
        </>
    );
}
