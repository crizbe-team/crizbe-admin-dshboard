'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function AuthTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!isMounted) {
        return <div className="w-full h-full flex justify-center items-center">{children}</div>;
    }

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={pathname}
                    className="w-full h-full flex justify-center items-center"
                    variants={{
                        initial: {
                            x: '100%',
                            opacity: 1,
                        },
                        animate: {
                            x: 0,
                            opacity: 1,
                        },
                        exit: {
                            x: '-100%',
                            opacity: 0.9, // Slight fade on exit
                        },
                    }}
                    transition={{
                        type: 'spring',
                        damping: 26,
                        stiffness: 210,
                        mass: 0.8,
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
