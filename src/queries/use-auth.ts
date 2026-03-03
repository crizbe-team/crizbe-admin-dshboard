import { useMutation } from '@tanstack/react-query';
import { login, signupInitiate, signupVerifyOtp, signupSetPassword, logout } from '../services/auth';
import { authUtils } from '../utils/auth';

export const useLogin = () => {
    return useMutation({
        mutationFn: (userData: any) => login(userData),
        onSuccess: (data: any) => {
            if (data.access && data.refresh) {
                authUtils.setTokens({
                    access_token: data.access,
                    refresh_token: data.refresh,
                });
            } else if (data.data && data.data.access && data.data.refresh) {
                authUtils.setTokens({
                    access_token: data.data.access,
                    refresh_token: data.data.refresh,
                });
            }
        },
    });
};

export const useSignupInitiate = () => {
    return useMutation({
        mutationFn: (userData: any) => signupInitiate(userData),
    });
};

export const useSignupVerifyOtp = () => {
    return useMutation({
        mutationFn: (otpData: any) => signupVerifyOtp(otpData),
        onSuccess: (data: any) => {
            if (data.access && data.refresh) {
                authUtils.setTokens({
                    access_token: data.access,
                    refresh_token: data.refresh,
                });
            } else if (data.data && data.data.access && data.data.refresh) {
                authUtils.setTokens({
                    access_token: data.data.access,
                    refresh_token: data.data.refresh,
                });
            }
        },
    });
};

export const useSignupSetPassword = () => {
    return useMutation({
        mutationFn: (passwordData: any) => signupSetPassword(passwordData),
        onSuccess: (data: any) => {
            if (data.access && data.refresh) {
                authUtils.setTokens({
                    access_token: data.access,
                    refresh_token: data.refresh,
                });
            } else if (data.data && data.data.access && data.data.refresh) {
                authUtils.setTokens({
                    access_token: data.data.access,
                    refresh_token: data.data.refresh,
                });
            }
        },
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            authUtils.removeTokens();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        },
    });
};
