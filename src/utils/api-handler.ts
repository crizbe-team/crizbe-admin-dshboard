export const handleApiResponse = <T>(response: any): T => {
    console.log('response?.data:', response?.data);
    const { status_code, message, data, errors } = response?.data;

    if (status_code === 6001) {
        throw { message, errors: errors };
    }
    return response.data;
};
