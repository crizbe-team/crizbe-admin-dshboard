import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getCountries, getStates } from '../services/core';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_COUNTRIES, GET_STATES } = API_ENDPOINTS;

export const useFetchCountries = (filters: any = {}) => {
    return useQuery({
        queryKey: [GET_COUNTRIES, filters],
        queryFn: () => getCountries(filters),
        staleTime: 1000 * 60 * 60, // Cache for 1 hour as countries rarely change
    });
};

export const useFetchStates = (filters: any = {}) => {
    return useQuery({
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
