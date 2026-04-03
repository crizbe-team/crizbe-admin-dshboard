'use client';

import { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function AuthProviders({ children }: { children: ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <GoogleReCaptchaProvider
                reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                scriptProps={{
                    async: false,
                    defer: false,
                    appendTo: 'head',
                    nonce: undefined,
                }}
            >
                {children}
            </GoogleReCaptchaProvider>
        </GoogleOAuthProvider>
    );
}
