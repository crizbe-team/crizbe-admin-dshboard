import { useMutation, useQuery } from '@tanstack/react-query';
import { submitEnquiry, fetchEnquiries, fetchEnquiryDetail, deleteEnquiry, updateEnquiry } from '../services/contact';
import { ContactFormData } from '../validations/contact';

export const useFetchEnquiries = (params?: { q?: string; page?: number }) => {
    return useQuery({
        queryKey: ['enquiries', params],
        queryFn: () => fetchEnquiries(params),
    });
};

export const useFetchEnquiryDetail = (id: string, enabled = true) => {
    return useQuery({
        queryKey: ['enquiry', id],
        queryFn: () => fetchEnquiryDetail(id),
        enabled: !!id && enabled,
    });
};

export const useSubmitContactForm = () => {
    return useMutation({
        mutationFn: (data: ContactFormData) => submitEnquiry(data),
    });
};

export const useUpdateEnquiry = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ContactFormData> }) =>
            updateEnquiry(id, data),
    });
};

export const useDeleteEnquiry = () => {
    return useMutation({
        mutationFn: (id: string) => deleteEnquiry(id),
    });
};
