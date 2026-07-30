'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { getCurrencyRates } from '@/services/core';

export interface CurrencyItem {
    code: string;
    symbol: string;
    name: string;
}

export interface CurrencyRates {
    [key: string]: number;
}

interface CurrencyContextType {
    currency: string;
    rates: CurrencyRates;
    currencies: CurrencyItem[];
    supportedCurrencies: string[];
    setCurrency: (currency: string) => void;
    convertPrice: (priceInINR: number | string) => string;
    isLoading: boolean;
    refetchRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const KNOWN_CURRENCY_METADATA: Record<string, { symbol: string; name: string }> = {
    INR: { symbol: '₹', name: 'Indian Rupee' },
    USD: { symbol: '$', name: 'US Dollar' },
    AED: { symbol: 'د.إ', name: 'UAE Dirham' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    CAD: { symbol: 'CA$', name: 'Canadian Dollar' },
    AUD: { symbol: 'A$', name: 'Australian Dollar' },
    SAR: { symbol: 'ر.س', name: 'Saudi Riyal' },
    QAR: { symbol: 'ر.ق', name: 'Qatari Riyal' },
    OMR: { symbol: 'ر.ع.', name: 'Omani Rial' },
    KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar' },
    BHD: { symbol: '.د.ب', name: 'Bahraini Dinar' },
    SGD: { symbol: 'S$', name: 'Singapore Dollar' },
    JPY: { symbol: '¥', name: 'Japanese Yen' },
    CNY: { symbol: '¥', name: 'Chinese Yuan' },
};

function getCurrencySymbol(code: string): string {
    if (KNOWN_CURRENCY_METADATA[code]?.symbol) {
        return KNOWN_CURRENCY_METADATA[code].symbol;
    }
    try {
        const parts = new Intl.NumberFormat('en', { style: 'currency', currency: code })
            .formatToParts(1);
        const symbolPart = parts.find((p) => p.type === 'currency');
        return symbolPart ? symbolPart.value : code;
    } catch {
        return code;
    }
}

function getCurrencyName(code: string): string {
    if (KNOWN_CURRENCY_METADATA[code]?.name) {
        return KNOWN_CURRENCY_METADATA[code].name;
    }
    return code;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<string>('INR');
    const [rates, setRates] = useState<CurrencyRates>({
        INR: 1,
        USD: 0.012,
        AED: 0.044,
        EUR: 0.011,
        GBP: 0.0095,
    });
    const [apiCurrencies, setApiCurrencies] = useState<CurrencyItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Compute dynamic list of supported currencies from rates/API
    const supportedCurrencies = useMemo(() => {
        const keys = Object.keys(rates);
        return keys.length > 0 ? keys : ['INR', 'USD', 'AED', 'EUR', 'GBP'];
    }, [rates]);

    const currencies: CurrencyItem[] = useMemo(() => {
        if (apiCurrencies && apiCurrencies.length > 0) {
            return apiCurrencies;
        }
        return supportedCurrencies.map((code) => ({
            code,
            symbol: getCurrencySymbol(code),
            name: getCurrencyName(code),
        }));
    }, [supportedCurrencies, apiCurrencies]);

    // Fetch exchange rates from backend service
    const fetchExchangeRates = async () => {
        try {
            const res = await getCurrencyRates();
            const fetchedRates = res?.data?.rates || (res?.data as any);

            if (fetchedRates && typeof fetchedRates === 'object') {
                setRates((prev) => ({ ...prev, ...fetchedRates }));
            }

            if (Array.isArray(res?.data?.currencies)) {
                setApiCurrencies(res.data.currencies);
            }
        } catch (error) {
            console.error('Failed to fetch exchange rates via core service:', error);
        }
    };

    // Auto-detect user's currency using ipapi.co
    const detectUserCurrency = async (availableCurrencies: string[]) => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data.currency && availableCurrencies.includes(data.currency)) {
                setCurrencyState(data.currency);
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
            try {
                await fetchExchangeRates();

                const savedCurrency = localStorage.getItem('selectedCurrency');
                if (savedCurrency) {
                    setCurrencyState(savedCurrency);
                } else {
                    await detectUserCurrency(supportedCurrencies);
                }
            } catch (error) {
                console.error('Initialization error in CurrencyProvider:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeCurrency();
    }, []);

    const setCurrency = (newCurrency: string) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('selectedCurrency', newCurrency);
    };

    const convertPrice = (priceInINR: number | string): string => {
        const price = Number(priceInINR) || 0;
        const rateMultiplier = rates[currency] ?? 1;
        const convertedPrice = price * rateMultiplier;

        const localeMap: Record<string, string> = {
            INR: 'en-IN',
            USD: 'en-US',
            AED: 'en-AE',
            EUR: 'en-IE',
            GBP: 'en-GB',
            CAD: 'en-CA',
            AUD: 'en-AU',
            SAR: 'ar-SA',
            QAR: 'ar-QA',
        };

        const locale = localeMap[currency] || 'en-US';

        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: currency === 'INR' ? 0 : 2,
                maximumFractionDigits: currency === 'INR' ? 0 : 2,
            }).format(convertedPrice);
        } catch {
            const symbol = getCurrencySymbol(currency);
            return `${symbol}${convertedPrice.toFixed(2)}`;
        }
    };

    const value: CurrencyContextType = {
        currency,
        rates,
        currencies,
        supportedCurrencies,
        setCurrency,
        convertPrice,
        isLoading,
        refetchRates: fetchExchangeRates,
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
