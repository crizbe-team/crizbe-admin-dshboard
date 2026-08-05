'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export default function SmoothScroll() {
    useEffect(() => {
        let lenis;
        let isMounted = true;

        // Reset scroll restoration to manual so GSAP initializes cleanly at top
        if (typeof window !== 'undefined') {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);
        }

        gsap.registerPlugin(ScrollTrigger);

        // Initialize Lenis smooth scrolling for native, 60fps/120fps ultra-smooth scrolling
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        // Synchronize Lenis scroll updates with GSAP ScrollTrigger
        lenis.on('scroll', () => {
            ScrollTrigger.update();
        });

        const updateRaf = (time) => {
            if (lenis) {
                lenis.raf(time * 1000);
            }
        };

        gsap.ticker.add(updateRaf);
        gsap.ticker.lagSmoothing(0);

        const mm = gsap.matchMedia();

        mm.add('(min-width: 980px)', () => {
            const almondBottle = document.querySelector('#almond-bottle');
            const hazelnutBottle = document.querySelector('#hazelnut-bottle');
            const pistaBottle = document.querySelector('#pista-bottle');
            const almondBottleTarget = document.querySelector('.almond-bottle-target-position');
            const hazelnutBottleTarget = document.querySelector(
                '.hazelnut-bottle-target-position'
            );
            const pistaBottleTarget = document.querySelector('.pista-bottle-target-position');

            const horizontalWrapper = document.querySelector('.horizontal-scroll-wrapper');
            if (horizontalWrapper) {
                const scrollWidth = horizontalWrapper.scrollWidth - window.innerWidth;
                const horizontalTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.flavours-section',
                        start: 'top top',
                        end: () => `+=${scrollWidth}`,
                        scrub: 0.5,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                horizontalTl.to(horizontalWrapper, {
                    x: -scrollWidth,
                    ease: 'none',
                    duration: 1,
                });

                horizontalTl.from(
                    '.flavours-section h2, .flavours-section button:not(.view-all-btn), .flavours-section .parallax-content',
                    {
                        x: 100,
                        opacity: 0.8,
                        stagger: 0.05,
                        ease: 'power2.out',
                        duration: 0.3,
                    },
                    0
                );

                horizontalTl.set(
                    '.view-all-btn',
                    {
                        visibility: 'visible',
                        pointerEvents: 'auto',
                    },
                    0.75
                );

                horizontalTl.fromTo(
                    '.view-all-btn',
                    { y: 600 },
                    {
                        y: 0,
                        ease: 'power2.out',
                        duration: 0.25,
                    },
                    0.75
                );
            }

            const tl1 = gsap.timeline({
                scrollTrigger: {
                    trigger: '.flavours-section',
                    start: 'top 80%',
                    end: 'top top',
                    scrub: true,
                    invalidateOnRefresh: true,
                    onToggle: (self) => {
                        const isPastEnd = self.progress === 1;
                        const heroBottles = [
                            '#almond-bottle',
                            '#hazelnut-bottle',
                            '#pista-bottle',
                        ];
                        const targetBottles = [
                            '#almond-bottle-target',
                            '#hazelnut-bottle-target',
                            '#pista-bottle-target',
                        ];

                        if (isPastEnd) {
                            // Use visibility & opacity instead of display:none to preserve element bounding rect calculations
                            gsap.set(heroBottles, { visibility: 'hidden', opacity: 0 });
                            gsap.set(targetBottles, {
                                visibility: 'visible',
                                opacity: 1,
                            });
                        } else {
                            gsap.set(heroBottles, { visibility: 'visible', opacity: 1 });
                            gsap.set(targetBottles, {
                                visibility: 'hidden',
                                opacity: 0,
                            });
                        }
                    },
                },
            });

            if (almondBottleTarget && almondBottle) {
                tl1.to(
                    '#almond-bottle',
                    {
                        x: () => {
                            if (!almondBottleTarget || !almondBottle) return 0;
                            const tRect = almondBottleTarget.getBoundingClientRect();
                            const bRect = almondBottle.getBoundingClientRect();
                            if (bRect.width === 0 || tRect.width === 0) return 0;
                            const curX = gsap.getProperty(almondBottle, 'x');
                            return (
                                tRect.left +
                                tRect.width / 2 -
                                (bRect.left + bRect.width / 2) +
                                curX
                            );
                        },
                        y: () => {
                            if (!almondBottleTarget || !almondBottle) return 0;
                            const tRect = almondBottleTarget.getBoundingClientRect();
                            const bRect = almondBottle.getBoundingClientRect();
                            if (bRect.height === 0 || tRect.height === 0) return 0;
                            const curY = gsap.getProperty(almondBottle, 'y');
                            return (
                                tRect.top +
                                tRect.height / 2 -
                                (bRect.top + bRect.height / 2) +
                                curY
                            );
                        },
                        rotate: '0deg',
                        width: '230px',
                        ease: 'none',
                    },
                    'cookie'
                );
            }

            if (hazelnutBottleTarget && hazelnutBottle) {
                tl1.to(
                    '#hazelnut-bottle',
                    {
                        x: () => {
                            if (!hazelnutBottleTarget || !hazelnutBottle) return 0;
                            const tRect = hazelnutBottleTarget.getBoundingClientRect();
                            const bRect = hazelnutBottle.getBoundingClientRect();
                            if (bRect.width === 0 || tRect.width === 0) return 0;
                            const curX = gsap.getProperty(hazelnutBottle, 'x');
                            return (
                                tRect.left +
                                tRect.width / 2 -
                                (bRect.left + bRect.width / 2) +
                                curX
                            );
                        },
                        y: () => {
                            if (!hazelnutBottleTarget || !hazelnutBottle) return 0;
                            const tRect = hazelnutBottleTarget.getBoundingClientRect();
                            const bRect = hazelnutBottle.getBoundingClientRect();
                            if (bRect.height === 0 || tRect.height === 0) return 0;
                            const curY = gsap.getProperty(hazelnutBottle, 'y');
                            return (
                                tRect.top +
                                tRect.height / 2 -
                                (bRect.top + bRect.height / 2) +
                                curY
                            );
                        },
                        rotate: '0deg',
                        width: '230px',
                        ease: 'none',
                    },
                    'cookie'
                );
            }

            if (pistaBottleTarget && pistaBottle) {
                tl1.to(
                    '#pista-bottle',
                    {
                        x: () => {
                            if (!pistaBottleTarget || !pistaBottle) return 0;
                            const tRect = pistaBottleTarget.getBoundingClientRect();
                            const bRect = pistaBottle.getBoundingClientRect();
                            if (bRect.width === 0 || tRect.width === 0) return 0;
                            const curX = gsap.getProperty(pistaBottle, 'x');
                            return (
                                tRect.left +
                                tRect.width / 2 -
                                (bRect.left + bRect.width / 2) +
                                curX
                            );
                        },
                        y: () => {
                            if (!pistaBottleTarget || !pistaBottle) return 0;
                            const tRect = pistaBottleTarget.getBoundingClientRect();
                            const bRect = pistaBottle.getBoundingClientRect();
                            if (bRect.height === 0 || tRect.height === 0) return 0;
                            const curY = gsap.getProperty(pistaBottle, 'y');
                            return (
                                tRect.top +
                                tRect.height / 2 -
                                (bRect.top + bRect.height / 2) +
                                curY
                            );
                        },
                        rotate: '0deg',
                        width: '230px',
                        ease: 'none',
                    },
                    'cookie'
                );
            }

            const tlTransition = gsap.timeline({
                scrollTrigger: {
                    trigger: '.next-flavour-section',
                    start: 'top 80%',
                    end: 'top top',
                    scrub: true,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const isAtEnd = self.progress >= 0.99;
                        const oldBottle = document.querySelector('#pista-bottle-target');
                        const newBottle = document.querySelector('#next-pista-bottle');
                        if (oldBottle && newBottle) {
                            if (isAtEnd) {
                                gsap.set(oldBottle, { opacity: 0, visibility: 'hidden' });
                                gsap.set(newBottle, { opacity: 1, visibility: 'visible' });
                            } else {
                                gsap.set(oldBottle, { opacity: 1, visibility: 'visible' });
                                gsap.set(newBottle, { opacity: 0, visibility: 'hidden' });
                            }
                        }
                    },
                },
            });

            if (pistaBottleTarget) {
                const nextFlavourBottleTarget = document.querySelector('#next-flavour-bottle-target');
                const pistaBottleTargetEl = document.querySelector('#pista-bottle-target');
                tlTransition.to(
                    '#pista-bottle-target',
                    {
                        x: () => {
                            if (!nextFlavourBottleTarget || !pistaBottleTargetEl) return 0;
                            const tRect = nextFlavourBottleTarget.getBoundingClientRect();
                            const bRect = pistaBottleTargetEl.getBoundingClientRect();
                            if (bRect.width === 0 || tRect.width === 0) return 0;
                            const curX = gsap.getProperty(pistaBottleTargetEl, 'x');
                            return (
                                tRect.left +
                                tRect.width / 2 -
                                (bRect.left + bRect.width / 2) +
                                curX
                            );
                        },
                        y: () => {
                            if (!nextFlavourBottleTarget || !pistaBottleTargetEl) return 0;
                            const tRect = nextFlavourBottleTarget.getBoundingClientRect();
                            const bRect = pistaBottleTargetEl.getBoundingClientRect();
                            if (bRect.height === 0 || tRect.height === 0) return 0;
                            const curY = gsap.getProperty(pistaBottleTargetEl, 'y');
                            return (
                                tRect.top +
                                tRect.height / 2 -
                                (bRect.top + bRect.height / 2) +
                                curY
                            );
                        },
                        width: '230px',
                        ease: 'none',
                        duration: 1,
                    },
                    0
                );

                tlTransition.to(
                    '#pista-bottle-target',
                    {
                        yPercent: 15,
                        rotate: -12,
                        duration: 0.5,
                        yoyo: true,
                        repeat: 1,
                        ease: 'sine.inOut',
                    },
                    0
                );

                tlTransition.to(
                    '#pista-bottle-target',
                    {
                        xPercent: 5,
                        duration: 0.2,
                        repeat: 4,
                        yoyo: true,
                        ease: 'sine.inOut',
                    },
                    0
                );
            }

            const tl2 = gsap.timeline({
                scrollTrigger: {
                    trigger: '.next-flavour-section',
                    start: 'top top',
                    end: '+=100%',
                    scrub: true,
                    pin: true,
                    invalidateOnRefresh: true,
                },
            });

            tl2.from(
                '.next-flavour-line',
                {
                    x: -100,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'power2.out',
                    duration: 0.3,
                },
                0.1
            );

            tl2.from(
                '.next-flavour-card',
                {
                    x: 100,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'power2.out',
                    duration: 0.3,
                },
                0.4
            );

            tl2.set(
                '.flavor-selection-btns',
                {
                    visibility: 'visible',
                    pointerEvents: 'auto',
                },
                0.75
            );

            tl2.fromTo(
                '.flavor-selection-btns',
                { y: 600 },
                {
                    y: 0,
                    ease: 'power2.out',
                    duration: 0.25,
                },
                0.75
            );

            gsap.from('.quote-section-content', {
                scrollTrigger: {
                    trigger: '.quote-section',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
                y: 150,
                opacity: 0.5,
                scale: 0.9,
                ease: 'none',
            });
        });

        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);

        return () => {
            isMounted = false;
            mm.revert();
            gsap.ticker.remove(updateRaf);
            if (lenis) {
                lenis.destroy();
                lenis = null;
            }
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return null;
}
