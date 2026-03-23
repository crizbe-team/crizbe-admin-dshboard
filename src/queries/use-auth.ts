import { useMutation } from '@tanstack/react-query';
import {
    login,
    signupInitiate,
    forgotPassword,
    verifyOtp,
    signupResendOtp,
    setPassword,
    logout,
} from '../services/auth';
import { authUtils } from '../utils/auth';

export const useLogin = () => {
    return useMutation({
        mutationFn: (userData: any) => login(userData),
        onSuccess: (data: any) => {
            if (data.data && data.data.access && data.data.refresh) {
                authUtils.setTokens({
                    access_token: data.data.access,
                    refresh_token: data.data.refresh,
                });
                authUtils.setRole(data.data.role);
            }
        },
    });
};

export const useSignupInitiate = () => {
    return useMutation({
        mutationFn: (userData: any) => signupInitiate(userData),
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (userData: any) => forgotPassword(userData),
    });
};

export const useSignupResendOtp = () => {
    return useMutation({
        mutationFn: (resendData: any) => signupResendOtp(resendData),
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: (otpData: any) => verifyOtp(otpData),
    });
};

export const useSetPassword = () => {
    return useMutation({
        mutationFn: (passwordData: any) => setPassword(passwordData),
        onSuccess: (data: any) => {
            if (data.data && data.data.access && data.data.refresh) {
                authUtils.setTokens({
                    access_token: data.data.access,
                    refresh_token: data.data.refresh,
                });
                authUtils.setRole(data.data.role);
            }
        },
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            authUtils.removeTokens();
            authUtils.removeRole();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        },
    });
};
