'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

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
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_RATES: CurrencyRates = {
    INR: 1.0,
    USD: 0.012,
    AED: 0.044,
};

const KNOWN_CURRENCY_METADATA: Record<string, { symbol: string; name: string }> = {
    INR: { symbol: '₹', name: 'Indian Rupee' },
    USD: { symbol: '$', name: 'US Dollar' },
    AED: { symbol: 'د.إ', name: 'UAE Dirham' },
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

const TIMEZONE_TO_CURRENCY: Record<string, string> = {
    'Asia/Kolkata': 'INR',
    'Asia/Calcutta': 'INR',
    'America/New_York': 'USD',
    'America/Los_Angeles': 'USD',
    'America/Chicago': 'USD',
    'America/Denver': 'USD',
    'Asia/Dubai': 'AED',
    'Asia/Abu_Dhabi': 'AED',
};

const COUNTRY_CODE_TO_CURRENCY: Record<string, string> = {
    IN: 'INR',
    US: 'USD',
    AE: 'AED',
};

async function detectCurrencyFromRegion(): Promise<string | null> {
    // Strategy 1: Browser Timezone (Instant & works with Chrome DevTools Sensors!)
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timeZone && TIMEZONE_TO_CURRENCY[timeZone]) {
            return TIMEZONE_TO_CURRENCY[timeZone];
        }
    } catch {}

    // Strategy 2: ipapi.co
    try {
        const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data.currency) return data.currency;
            if (data.country_code && COUNTRY_CODE_TO_CURRENCY[data.country_code]) {
                return COUNTRY_CODE_TO_CURRENCY[data.country_code];
            }
        }
    } catch {}

    // Strategy 3: ipwho.is fallback
    try {
        const res = await fetch('https://ipwho.is/', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                if (data.currency?.code) return data.currency.code;
                if (data.country_code && COUNTRY_CODE_TO_CURRENCY[data.country_code]) {
                    return COUNTRY_CODE_TO_CURRENCY[data.country_code];
                }
            }
        }
    } catch {}

    // Strategy 4: Browser Language / Locale
    try {
        const lang = typeof navigator !== 'undefined' ? navigator.language || '' : '';
        const country = lang.split('-')[1]?.toUpperCase();
        if (country && COUNTRY_CODE_TO_CURRENCY[country]) {
            return COUNTRY_CODE_TO_CURRENCY[country];
        }
    } catch {}

    return null;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<string>('INR');
    const [rates] = useState<CurrencyRates>(DEFAULT_RATES);
    const [isLoading, setIsLoading] = useState(true);

    const supportedCurrencies = useMemo(() => Object.keys(rates), [rates]);

    const currencies: CurrencyItem[] = useMemo(() => {
        return supportedCurrencies.map((code) => ({
            code,
            symbol: getCurrencySymbol(code),
            name: getCurrencyName(code),
        }));
    }, [supportedCurrencies]);

    // Initialize currency strictly with automatic region detection
    useEffect(() => {
        const initializeCurrency = async () => {
            setIsLoading(true);
            try {
                const autoDetected = await detectCurrencyFromRegion();
                if (autoDetected && rates[autoDetected]) {
                    setCurrencyState(autoDetected);
                } else if (autoDetected) {
                    setCurrencyState(autoDetected);
                } else {
                    setCurrencyState('INR');
                }
            } catch (error) {
                console.error('Initialization error in CurrencyProvider:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeCurrency();
    }, [rates]);

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
        };

        const locale = localeMap[currency] || 'en-US';

        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: currency === 'INR' || currency === 'JPY' ? 0 : 2,
                maximumFractionDigits: currency === 'INR' || currency === 'JPY' ? 0 : 2,
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
