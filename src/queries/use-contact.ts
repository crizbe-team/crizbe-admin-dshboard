import { useMutation } from '@tanstack/react-query';
import { submitEnquiry } from '../services/contact';
import { ContactFormData } from '../validations/contact';

export const useSubmitContactForm = () => {
    return useMutation({
        mutationFn: (data: ContactFormData) => submitEnquiry(data),
    });
};
