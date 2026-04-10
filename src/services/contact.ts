import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { handleApiResponse } from '../utils/api-handler';
import { ContactFormData } from '../validations/contact';

export const fetchEnquiries = async (params?: {
    q?: string;
    page?: number;
}): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: any[];
    base_data?: any;
    pagination?: {
        total_pages: number;
        has_next: boolean;
        has_previous: boolean;
    };
    errors: Record<string, any> | null;
}> => {
    const { GET_ENQUIRIES } = API_ENDPOINTS;
    const response = await api.get(GET_ENQUIRIES, { params });
    return handleApiResponse(response);
};

export const fetchEnquiryDetail = async (
    id: string
): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: any;
    errors: Record<string, any> | null;
}> => {
    const { GET_ENQUIRY_DETAIL } = API_ENDPOINTS;
    const response = await api.get(GET_ENQUIRY_DETAIL.replace(':id', id));
    return handleApiResponse(response);
};

export const submitEnquiry = async (
    data: ContactFormData
): Promise<{
    status_code: number;
    status: string;
    message: string;
    data: any;
    errors: Record<string, any> | null;
}> => {
    const { ENQUIRY } = API_ENDPOINTS;
    const response = await api.post(ENQUIRY, data);
    return handleApiResponse(response);
};
