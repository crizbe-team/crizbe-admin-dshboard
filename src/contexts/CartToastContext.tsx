'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useFetchMinimalDetails } from '@/queries/use-account';
import { authUtils } from '@/utils/auth';

interface CartItemData {
    name: string;
    image: string;
    weight: string;
    qty: number;
}

interface CartToastContextType {
    showToast: (item: CartItemData) => void;
    hideToast: () => void;
}

const CartToastContext = createContext<CartToastContextType | undefined>(undefined);

export const useCartToast = () => {
    const context = useContext(CartToastContext);
    if (!context) {
        throw new Error('useCartToast must be used within a CartToastProvider');
    }
    return context;
};

import CartSuccessToast from '@/components/user/CartSuccessToast';

export const CartToastProvider = ({ children }: { children: ReactNode }) => {
    const [toastItem, setToastItem] = useState<CartItemData | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Fetch minimal details for the cart count in "View cart (n)"
    const isAuthenticated = authUtils.isAuthenticated();
    const { data: minimalDetailsRes } = useFetchMinimalDetails(isAuthenticated);
    const cartCount = minimalDetailsRes?.data?.cart_count || 0;

    const showToast = (item: CartItemData) => {
        setToastItem(item);
        setIsVisible(true);
        // Auto-hide after 5 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 5000);
    };

    const hideToast = () => {
        setIsVisible(false);
    };

    return (
        <CartToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <CartSuccessToast
                item={toastItem}
                isVisible={isVisible}
                onClose={hideToast}
                cartCount={cartCount}
            />
        </CartToastContext.Provider>
    );
};
