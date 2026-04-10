import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { handleApiResponse } from '../utils/api-handler';
import { ContactFormData } from '../validations/contact';

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
