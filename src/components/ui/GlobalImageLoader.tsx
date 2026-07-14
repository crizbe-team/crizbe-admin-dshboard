'use client';

import { useEffect } from 'react';

export default function GlobalImageLoader() {
    useEffect(() => {
        let observer: MutationObserver | null = null;
        let loadListenerActive = false;

        const handleLoad = (e: Event) => {
            if (e.target instanceof HTMLImageElement) {
                e.target.classList.add('img-loaded');
            }
        };

        const timer = setTimeout(() => {
            // Capture phase to catch 'load' event on all images
            document.addEventListener('load', handleLoad, true);
            loadListenerActive = true;

            // Check already completed images (e.g. cached or SSR loaded)
            const checkExisting = () => {
                const images = document.querySelectorAll('img');
                images.forEach((img) => {
                    if (img.complete) {
                        img.classList.add('img-loaded');
                    }
                });
            };

            checkExisting();

            // Also run check on mutation observer to handle client-side rendered images dynamically
            observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node instanceof HTMLImageElement) {
                            if (node.complete) node.classList.add('img-loaded');
                        } else if (node instanceof HTMLElement) {
                            node.querySelectorAll('img').forEach((img) => {
                                if (img.complete) img.classList.add('img-loaded');
                            });
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }, 1000);

        return () => {
            clearTimeout(timer);
            if (loadListenerActive) {
                document.removeEventListener('load', handleLoad, true);
            }
            if (observer) {
                observer.disconnect();
            }
        };
    }, []);

    return null;
}
