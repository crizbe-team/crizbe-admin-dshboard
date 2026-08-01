import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAdminNotifications,
    markNotificationRead,
    clearNotifications,
    subscribePushNotification,
} from '../services/notification';
import { API_ENDPOINTS } from '../utils/api-endpoints';

const { GET_ADMIN_NOTIFICATIONS } = API_ENDPOINTS;

export const useFetchAdminNotifications = (enabled: boolean = true) => {
    return useQuery({
        queryKey: [GET_ADMIN_NOTIFICATIONS],
        queryFn: () => getAdminNotifications(),
        enabled: enabled,
        refetchInterval: 15000, // Poll every 15 seconds cleanly when tab is open
        staleTime: 10000,
    });
};

export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { notification_id?: string; mark_all?: boolean }) =>
            markNotificationRead(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_NOTIFICATIONS] });
        },
    });
};

export const useClearNotifications = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => clearNotifications(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GET_ADMIN_NOTIFICATIONS] });
        },
    });
};

export const useSubscribePushNotification = () => {
    return useMutation({
        mutationFn: (payload: { endpoint: string; p256dh: string; auth: string }) =>
            subscribePushNotification(payload),
    });
};
