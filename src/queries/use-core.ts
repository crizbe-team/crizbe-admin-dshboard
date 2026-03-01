import { useQuery } from '@tanstack/react-query';
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
