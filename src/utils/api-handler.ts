/**
 * Handles API response validation and error throwing
 * @param response - The axios response object
 * @param options - Optional configuration for error handling
 * @param options.successCodes - Array of status codes to consider as success (default: [200, 6000])
 * @param options.errorCodes - Array of status codes to treat as errors (default: [6001])
 * @returns The response data if successful
 * @throws Error object with message and errors properties
 */
export const handleApiResponse = <T>(
    response: any,
    options?: {
        successCodes?: number[];
        errorCodes?: number[];
    }
): T => {
    const { status_code, message, data } = response?.data;
    
    // Default success and error codes
    const successCodes = options?.successCodes || [200, 6000];
    const errorCodes = options?.errorCodes || [6001];
    
    // Check if status code is in error codes list
    if (errorCodes.includes(status_code)) {
        const errorText = typeof message === 'string' 
            ? message 
            : message?.body || 'Request failed';
        
        throw { message: errorText, errors: data };
    }
    
    // Check if status code is NOT in success codes list
    if (!successCodes.includes(status_code)) {
        const errorText = typeof message === 'string' 
            ? message 
            : message?.body || 'Request failed';
        
        throw { message: errorText, errors: data };
    }
    
    return response?.data;
};

