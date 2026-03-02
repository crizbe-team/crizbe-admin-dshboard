'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';

interface CurrencyRates {
    [key: string]: number;
}

interface CurrencyContextType {
    currency: string;
    rates: CurrencyRates;
    setCurrency: (currency: string) => void;
    convertPrice: (priceInINR: number | string) => string;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const SUPPORTED_CURRENCIES = ['INR', 'USD', 'AED', 'EUR', 'GBP'];

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<string>('INR');
    const [rates, setRates] = useState<CurrencyRates>({ INR: 1 });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch exchange rates from API
    const fetchExchangeRates = async () => {
        try {
            const response = await api.get('core/currency-rates/');
            console.log("response.data.rates",response.data.data.rates)
            setRates(response.data.data.rates);
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
            // Fallback rates if API fails
            setRates({
                INR: 1,
                USD: 0.012,
                AED: 0.044,
                EUR: 0.011,
                GBP: 0.0095,
            });
        }
    };

    // Auto-detect user's currency using ipapi.co
    const detectUserCurrency = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data.currency && SUPPORTED_CURRENCIES.includes(data.currency)) {
                setCurrencyState(data.currency);
                // Store in localStorage for persistence
                localStorage.setItem('selectedCurrency', data.currency);
            }
        } catch (error) {
            console.error('Failed to detect user currency:', error);
        }
    };

    // Initialize currency and rates
    useEffect(() => {
        const initializeCurrency = async () => {
            setIsLoading(true);

            // Check localStorage first
            const savedCurrency = localStorage.getItem('selectedCurrency');
            if (savedCurrency && SUPPORTED_CURRENCIES.includes(savedCurrency)) {
                setCurrencyState(savedCurrency);
            } else {
                // Auto-detect if no saved currency
                await detectUserCurrency();
            }

            // Fetch exchange rates
            await fetchExchangeRates();

            setIsLoading(false);
        };

        initializeCurrency();
    }, []);

    const setCurrency = (newCurrency: string) => {
        if (SUPPORTED_CURRENCIES.includes(newCurrency)) {
            setCurrencyState(newCurrency);
            localStorage.setItem('selectedCurrency', newCurrency);
        }
    };

    const convertPrice = (priceInINR: number | string): string => {
        const price = Number(priceInINR) || 0;
        const convertedPrice = price * (rates[currency] || 1);

        // Format based on currency
        const localeMap: { [key: string]: string } = {
            INR: 'en-IN',
            USD: 'en-US',
            AED: 'en-AE',
            EUR: 'en-IE',
            GBP: 'en-GB',
        };

        const locale = localeMap[currency] || 'en-IN';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'INR' ? 0 : 2,
            maximumFractionDigits: currency === 'INR' ? 0 : 2,
        }).format(convertedPrice);
    };

    const value: CurrencyContextType = {
        currency,
        rates,
        setCurrency,
        convertPrice,
        isLoading,
    };

    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
