'use client';

import { toast as sonnerToast, Toaster } from 'sonner';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export const toast = {
    success: (message: string) => {
        sonnerToast.success(message);
    },
    error: (message: string) => {
        sonnerToast.error(message);
    },
    warning: (message: string) => {
        sonnerToast.warning(message);
    },
    info: (message: string) => {
        sonnerToast.info(message);
    },
    dismiss: (id?: string | number) => {
        sonnerToast.dismiss(id);
    },
};

export const ToastContainer = () => {
    return <Toaster position="top-right" richColors expand={false} closeButton />;
};
