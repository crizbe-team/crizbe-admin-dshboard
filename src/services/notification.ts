import api from '../lib/axios';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiBuilder } from '../utils/api-builder';
import { handleApiResponse } from '../utils/api-handler';

export interface AdminNotificationData {
    id: string;
    title: string;
    message: string;
    notification_type: 'order_created' | 'order_cancelled' | 'low_stock' | 'system';
    reference_id?: string | null;
    is_read: boolean;
    created_at: string;
}

export const getAdminNotifications = async () => {
    const { GET_ADMIN_NOTIFICATIONS } = API_ENDPOINTS;
    const url = new ApiBuilder(GET_ADMIN_NOTIFICATIONS).build();
    const response = await api.get(url);
    return handleApiResponse(response);
};

export const markNotificationRead = async (payload: { notification_id?: string; mark_all?: boolean }) => {
    const { MARK_ADMIN_NOTIFICATION_READ } = API_ENDPOINTS;
    const url = new ApiBuilder(MARK_ADMIN_NOTIFICATION_READ).build();
    const response = await api.post(url, payload);
    return handleApiResponse(response);
};

export const clearNotifications = async () => {
    const { CLEAR_ADMIN_NOTIFICATIONS } = API_ENDPOINTS;
    const url = new ApiBuilder(CLEAR_ADMIN_NOTIFICATIONS).build();
    const response = await api.post(url);
    return handleApiResponse(response);
};

export const subscribePushNotification = async (payload: { endpoint: string; p256dh: string; auth: string }) => {
    const { SUBSCRIBE_PUSH_NOTIFICATION } = API_ENDPOINTS;
    const url = new ApiBuilder(SUBSCRIBE_PUSH_NOTIFICATION).build();
    const response = await api.post(url, payload);
    return handleApiResponse(response);
};
