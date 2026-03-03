import Cookies from 'js-cookie';

export const SIGNUP_SESSION_KEYS = {
    USERNAME: 'signup_username',  // Single field for both email and phone
    COUNTRY_CODE: 'signup_country_code',
} as const;

export const signupSessionUtils = {
    setSignupData: (data: { username: string; countryCode?: string }) => {
        try {
            // Always store as username (whether email or phone)
            if (data.username) {
                Cookies.set(SIGNUP_SESSION_KEYS.USERNAME, data.username, {
                    expires: 1 / 24, // 1 hour
                    secure: process.env.NEXT_PUBLIC_SERVER === 'PRODUCTION',
                    sameSite: 'strict',
                    path: '/',
                });
            }
            
            if (data.countryCode) {
                Cookies.set(SIGNUP_SESSION_KEYS.COUNTRY_CODE, data.countryCode, {
                    expires: 1 / 24, // 1 hour
                    secure: process.env.NEXT_PUBLIC_SERVER === 'PRODUCTION',
                    sameSite: 'strict',
                    path: '/',
                });
            }
        } catch (error) {
            console.error('Error setting signup data:', error);
        }
    },

    getSignupData: () => {
        return {
            username: Cookies.get(SIGNUP_SESSION_KEYS.USERNAME) || '',
            countryCode: Cookies.get(SIGNUP_SESSION_KEYS.COUNTRY_CODE) || '+91',
        };
    },

    clearSignupData: () => {
        try {
            Cookies.remove(SIGNUP_SESSION_KEYS.USERNAME);
            Cookies.remove(SIGNUP_SESSION_KEYS.COUNTRY_CODE);
        } catch (error) {
            console.error('Error clearing signup data:', error);
        }
    },
};
