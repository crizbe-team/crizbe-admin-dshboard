// @ts-nocheck

import Cookies from 'js-cookie';

export const AUTH_TOKEN_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
} as const;

export const authUtils = {
    setTokens: (tokens: { access_token: string; refresh_token: string }) => {
        try {
            Cookies.set(AUTH_TOKEN_KEYS.ACCESS_TOKEN, tokens.access_token, {
                expires: 7,
                secure: process.env.NEXT_PUBLIC_SERVER === 'PRODUCTION',
                sameSite: 'strict',
                path: '/',
            });

            Cookies.set(AUTH_TOKEN_KEYS.REFRESH_TOKEN, tokens.refresh_token, {
                expires: 30,
                secure: process.env.NEXT_PUBLIC_SERVER === 'PRODUCTION',
                sameSite: 'strict',
                path: '/',
            });
        } catch (error) {
            console.error('Error setting tokens:', error);
        }
    },

    getAccessToken: () => {
        return Cookies.get(AUTH_TOKEN_KEYS.ACCESS_TOKEN);
    },

    getRefreshToken: () => {
        return Cookies.get(AUTH_TOKEN_KEYS.REFRESH_TOKEN);
    },

    removeTokens: () => {
        try {
            Cookies.remove(AUTH_TOKEN_KEYS.ACCESS_TOKEN);
            Cookies.remove(AUTH_TOKEN_KEYS.REFRESH_TOKEN);
        } catch (error) {
            console.error('Error removing tokens:', error);
        }
    },

    isAuthenticated: () => {
        return !!Cookies.get(AUTH_TOKEN_KEYS.ACCESS_TOKEN);
    },

    updateAccessToken: (newAccessToken: string) => {
        try {
            Cookies.set(AUTH_TOKEN_KEYS.ACCESS_TOKEN, newAccessToken, {
                expires: 7,
                secure: process.env.NEXT_PUBLIC_SERVER === 'PRODUCTION',
                sameSite: 'strict',
                path: '/',
            });
        } catch (error) {
            console.error('Error updating access token:', error);
        }
    },

    getTokens: () => {
        return {
            access_token: Cookies.get(AUTH_TOKEN_KEYS.ACCESS_TOKEN) || '',
            refresh_token: Cookies.get(AUTH_TOKEN_KEYS.REFRESH_TOKEN) || '',
        };
    },

    parseJwt: (token: string) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
    },

    isTokenExpired: (token: string): boolean => {
        if (!token) return true;

        const payload = authUtils.parseJwt(token);
        if (!payload) return true;

        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    },
};
