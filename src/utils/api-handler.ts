export const handleApiResponse = <T>(response: any): T => {
    const { status_code, message, data, errors } = response?.data;

    if (status_code === 6000) {
        return response.data;
    }
    throw { message, errors };
};
