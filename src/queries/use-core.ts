import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
    getCountries,
    getStates,
    getCurrencyRates,
    getAdminCurrencies,
    createAdminCurrency,
    updateAdminCurrency,
    deleteAdminCurrency,
    CurrencyData,
} from '../services/core';
import { API_ENDPOINTS } from '../utils/api-endpoints';

type Country = {
    id: string;
    name: string;
    phone_code: string;
};

type State = {
    id: string;
    name: string;
};

type ApiResponse<T> = {
    status_code: number;
    status: string;
    message: string;
    data: T;
    errors: Record<string, any> | null;
};

const { GET_COUNTRIES, GET_STATES, GET_CURRENCY_RATES, GET_ADMIN_CURRENCIES } = API_ENDPOINTS;

export const useFetchCurrencyRates = () => {
    return useQuery({
        queryKey: [GET_CURRENCY_RATES],
        queryFn: () => getCurrencyRates(),
        staleTime: 1000 * 60 * 15,
    });
};

export const useFetchAdminCurrencies = () => {
    return useQuery({
        queryKey: [GET_ADMIN_CURRENCIES],
        queryFn: () => getAdminCurrencies(),
        staleTime: 1000 * 60 * 2,
    });
};

export const useCreateCurrencyMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<CurrencyData>) => createAdminCurrency(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_CURRENCIES] });
            queryClient.invalidateQueries({ queryKey: [GET_CURRENCY_RATES] });
        },
    });
};

export const useUpdateCurrencyMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CurrencyData> }) =>
            updateAdminCurrency(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_CURRENCIES] });
            queryClient.invalidateQueries({ queryKey: [GET_CURRENCY_RATES] });
        },
    });
};

export const useDeleteCurrencyMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAdminCurrency(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_CURRENCIES] });
            queryClient.invalidateQueries({ queryKey: [GET_CURRENCY_RATES] });
        },
    });
};

export const useFetchCountries = (filters: any = {}) => {
    return useQuery<ApiResponse<Country[]>>({
        queryKey: [GET_COUNTRIES, filters],
        queryFn: () => getCountries(filters),
        staleTime: 1000 * 60 * 60, // Cache for 1 hour as countries rarely change
    });
};

export const useFetchStates = (filters: any = {}) => {
    return useQuery<ApiResponse<State[]>>({
        queryKey: [GET_STATES, filters],
        queryFn: () => getStates(filters),
        staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    });
};

// Infinite scroll versions
export const useFetchCountriesInfinite = (filters: any = {}) => {
    return useInfiniteQuery({
        queryKey: [GET_COUNTRIES, filters, 'infinite'],
        queryFn: ({ pageParam = 1 }) => getCountries({ ...filters, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage: any, allPages: any[]) => {
            // Assuming API returns pagination info in the response
            if (lastPage?.next) {
                const nextPage = new URL(lastPage.next).searchParams.get('page');
                return nextPage ? parseInt(nextPage) : allPages.length + 1;
            }
            // If there's no next URL but we have data, try next page
            if (lastPage?.data && lastPage.data.length > 0) {
                return allPages.length + 1;
            }
            return undefined;
        },
        staleTime: 1000 * 60 * 60,
    });
};

export const useFetchStatesInfinite = (filters: any = {}) => {
    return useInfiniteQuery({
        queryKey: [GET_STATES, filters, 'infinite'],
        queryFn: ({ pageParam = 1 }) => getStates({ ...filters, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage: any, allPages: any[]) => {
            // Assuming API returns pagination info in the response
            if (lastPage?.next) {
                const nextPage = new URL(lastPage.next).searchParams.get('page');
                return nextPage ? parseInt(nextPage) : allPages.length + 1;
            }
            // If there's no next URL but we have data, try next page
            if (lastPage?.data && lastPage.data.length > 0) {
                return allPages.length + 1;
            }
            return undefined;
        },
        staleTime: 1000 * 60 * 30,
    });
};
