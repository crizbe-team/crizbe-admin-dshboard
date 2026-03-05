import { useState, useEffect } from 'react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const useRazorpay = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
            setIsLoaded(true);
        };
        
        script.onerror = () => {
            console.error('Failed to load Razorpay SDK');
            setIsLoaded(false);
        };
        
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const openCheckout = (options: any) => {
        if (!isLoaded) {
            console.error('Razorpay SDK not loaded');
            return;
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return { isLoaded, openCheckout };
};