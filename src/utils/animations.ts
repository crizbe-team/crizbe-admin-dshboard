import { Variants } from 'framer-motion';

export function fadeInOut(duration: number = 0.2): Variants {
    return {
        from: {
            opacity: 0,
            transition: {
                ease: 'easeInOut',
                duration: duration,
            },
        },
        to: {
            opacity: 1,
            transition: {
                ease: 'easeInOut',
                duration: duration,
            },
        },
    };
}

export function zoomOutIn(duration: number = 0.2): Variants {
    return {
        from: {
            scale: 1.1,
            transition: {
                ease: 'easeOut',
                duration: duration,
            },
        },
        to: {
            scale: 1,
            transition: {
                ease: 'easeOut',
                duration: duration,
            },
        },
    };
}
