import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

type Country = {
    id: string;
    name: string;
    phone_code: string;
};

type State = {
    id: string;
    name: string;
};

export const getCountries = async (
    params: any = {}
): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: Country[];
    errors: Record<string, any> | null;
}> => {
    const { GET_COUNTRIES } = API_ENDPOINTS;

    const builder = new ApiBuilder(GET_COUNTRIES);

    // Add query parameters if provided
    if (params.q) {
        builder.query('q', params.q);
    }
    if (params.page) {
        builder.query('page', params.page);
    }
    if (params.limit) {
        builder.query('limit', params.limit);
    }

    const url = builder.build();
    const response = await api.get(url);

    return handleApiResponse(response);
};

export const getStates = async (
    params: any = {}
): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: State[];
    errors: Record<string, any> | null;
}> => {
    const { GET_STATES } = API_ENDPOINTS;

    const builder = new ApiBuilder(GET_STATES);

    // Add query parameters if provided
    if (params.q) {
        builder.query('q', params.q);
    }
    if (params.page) {
        builder.query('page', params.page);
    }
    if (params.country) {
        builder.query('country', params.country);
    }

    const url = builder.build();
    const response = await api.get(url);

    return handleApiResponse(response);
};

export const getCurrencyRates = async (): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: {
        rates: Record<string, number>;
        currencies?: Array<{ code: string; symbol: string; name: string }>;
    };
    errors: Record<string, any> | null;
}> => {
    const { GET_CURRENCY_RATES } = API_ENDPOINTS;
    const builder = new ApiBuilder(GET_CURRENCY_RATES);
    const url = builder.build();
    const response = await api.get(url);

    return handleApiResponse(response);
};

export type CurrencyData = {
    id?: string;
    code: string;
    name: string;
    symbol: string;
    exchange_rate: number;
    is_default?: boolean;
    is_active?: boolean;
    display_order?: number;
};

export const getAdminCurrencies = async (): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: CurrencyData[];
    errors: Record<string, any> | null;
}> => {
    const { GET_ADMIN_CURRENCIES } = API_ENDPOINTS;
    const builder = new ApiBuilder(GET_ADMIN_CURRENCIES);
    const url = builder.build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const createAdminCurrency = async (data: Partial<CurrencyData>): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: CurrencyData;
    errors: Record<string, any> | null;
}> => {
    const { CREATE_ADMIN_CURRENCY } = API_ENDPOINTS;
    const builder = new ApiBuilder(CREATE_ADMIN_CURRENCY);
    const url = builder.build();
    const response = await api.post(url, data);
    return handleApiResponse(response);
};

export const updateAdminCurrency = async (id: string, data: Partial<CurrencyData>): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: CurrencyData;
    errors: Record<string, any> | null;
}> => {
    const { MANAGE_ADMIN_CURRENCY } = API_ENDPOINTS;
    const builder = new ApiBuilder(MANAGE_ADMIN_CURRENCY).path('id', id);
    const url = builder.build();
    const response = await api.patch(url, data);
    return handleApiResponse(response);
};

export const deleteAdminCurrency = async (id: string): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: null;
    errors: Record<string, any> | null;
}> => {
    const { MANAGE_ADMIN_CURRENCY } = API_ENDPOINTS;
    const builder = new ApiBuilder(MANAGE_ADMIN_CURRENCY).path('id', id);
    const url = builder.build();
    const response = await api.delete(url);
    return handleApiResponse(response);
};
