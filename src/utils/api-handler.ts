export const handleApiResponse = <T = any>(response: any): T => {
    const { status_code, message, data, errors } = response?.data || {};

    if (status_code === 6000 || status_code === 200 || status_code === 201) {
        return response.data;
    }

    // Fallback for unwrapped responses (if status_code is missing but it's a success status)
    if (!status_code && response?.status >= 200 && response?.status < 300) {
        return {
            status_code: response.status,
            data: response.data,
            message: 'Success',
        } as any;
    }

    throw { message, errors };
};
