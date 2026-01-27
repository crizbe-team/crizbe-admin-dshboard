import { useMutation } from '@tanstack/react-query';
import { login, LoginData } from '../services/auth';
import { authUtils } from '../utils/auth';

export const useLogin = () => {
    return useMutation({
        mutationFn: (userData: LoginData) => login(userData),
        onSuccess: (data: any) => {
            if (data.data) {
                authUtils.setTokens(data.data);
            }
        },
        onError: () => {},
    });
};
