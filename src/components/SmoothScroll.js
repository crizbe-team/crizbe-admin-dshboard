'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function SmoothScroll() {
    useEffect(() => {
        let locoScroll;
        let isMounted = true;

        const handleRefresh = () => {
            if (locoScroll && typeof locoScroll.update === 'function') {
                try {
                    locoScroll.update();
                } catch (e) {
                    console.warn('Locomotive Scroll update failed:', e);
                }
            }
        };

        const initScroll = async () => {
            const LocomotiveScroll = (await import('locomotive-scroll')).default;
            if (!isMounted) return;

            const scrollContainer = document.querySelector('.smooth-scroll');
            gsap.registerPlugin(ScrollTrigger);

            if (!scrollContainer) return;

            locoScroll = new LocomotiveScroll({
                el: scrollContainer,
                smooth: true,
                multiplier: 1,
            });

            locoScroll.on('scroll', ScrollTrigger.update);

            ScrollTrigger.scrollerProxy(scrollContainer, {
                scrollTop(value) {
                    if (!locoScroll || !locoScroll.scroll) return 0;
                    return arguments.length
                        ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
                        : locoScroll.scroll.instance.scroll.y;
                },
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight,
                    };
                },
                pinType: scrollContainer.style.transform ? 'transform' : 'fixed',
            });

            ScrollTrigger.addEventListener('refresh', handleRefresh);

            ScrollTrigger.defaults({ scroller: '.smooth-scroll' });

            const mm = gsap.matchMedia();

            mm.add('(min-width: 1024px)', () => {
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
                            scrub: 1,
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
                                gsap.set(heroBottles, { display: 'none' });
                                gsap.set(targetBottles, {
                                    visibility: 'visible',
                                    opacity: 1,
                                });
                            } else {
                                gsap.set(heroBottles, { display: 'block' });
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
                                const target = document.querySelector(
                                    '.almond-bottle-target-position'
                                );
                                const bottle = document.querySelector('#almond-bottle');
                                if (!target || !bottle) return 0;
                                const tRect = target.getBoundingClientRect();
                                const bRect = bottle.getBoundingClientRect();
                                const curX = gsap.getProperty(bottle, 'x');
                                return (
                                    tRect.left +
                                    tRect.width / 2 -
                                    (bRect.left + bRect.width / 2) +
                                    curX
                                );
                            },
                            y: () => {
                                const target = document.querySelector(
                                    '.almond-bottle-target-position'
                                );
                                const bottle = document.querySelector('#almond-bottle');
                                if (!target || !bottle) return 0;
                                const tRect = target.getBoundingClientRect();
                                const bRect = bottle.getBoundingClientRect();
                                const curY = gsap.getProperty(bottle, 'y');
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
                                const target = document.querySelector(
                                    '.hazelnut-bottle-target-position'
                                );
                                const bottle = document.querySelector('#hazelnut-bottle');
                                if (!target || !bottle) return 0;
                                const tRect = target.getBoundingClientRect();
                                const bRect = bottle.getBoundingClientRect();
                                const curX = gsap.getProperty(bottle, 'x');
                                return (
                                    tRect.left +
                                    tRect.width / 2 -
                                    (bRect.left + bRect.width / 2) +
                                    curX
                                );
                            },
                            y: () => {
                                const target = document.querySelector(
                                    '.hazelnut-bottle-target-position'
                                );
                                const bottle = document.querySelector('#hazelnut-bottle');
                                if (!target || !bottle) return 0;
                                const tRect = target.getBoundingClientRect();
                                const bRect = bottle.getBoundingClientRect();
                                const curY = gsap.getProperty(bottle, 'y');
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
                                const target = document.querySelector(
                                    '.pista-bottle-target-position'
                                );
                                const bottle = document.querySelector('#pista-bottle');
                                if (!target || !bottle) return 0;
                                const tRect = target.getBoundingClientRect();
                                const bRect = bottle.getBoundingClientRect();
                                const curX = gsap.getProperty(bottle, 'x');
                                return (
                                    tRect.left +
                                    tRect.width / 2 -
                                    (bRect.left + bRect.width / 2) +
                                    curX
                                );
                            },
                            y: () => {
                                const target = document.querySelector(
                                    '.pista-bottle-target-position'
                                );
                                const bottle = document.querySelector('#pista-bottle');
                                if (!target || !bottle) return 0;
                                const tRect = target.getBoundingClientRect();
                                const bRect = bottle.getBoundingClientRect();
                                const curY = gsap.getProperty(bottle, 'y');
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
                        onEnter: () => {
                            tlTransition.invalidate();
                        },
                    },
                });

                if (pistaBottleTarget) {
                    tlTransition.to(
                        '#pista-bottle-target',
                        {
                            x: () => {
                                const target = document.querySelector(
                                    '#next-flavour-bottle-target'
                                );
                                const bottle = document.querySelector('#pista-bottle-target');
                                if (!target || !bottle) return 0;
                                const tRect = target.getBoundingClientRect();
                                const bRect = bottle.getBoundingClientRect();
                                const curX = gsap.getProperty(bottle, 'x');
                                return (
                                    tRect.left +
                                    tRect.width / 2 -
                                    (bRect.left + bRect.width / 2) +
                                    curX
                                );
                            },
                            y: () => {
                                const target = document.querySelector(
                                    '#next-flavour-bottle-target'
                                );
                                const bottle = document.querySelector('#pista-bottle-target');
                                if (!target || !bottle) return 0;
                                const tRect = target.getBoundingClientRect();
                                const bRect = bottle.getBoundingClientRect();
                                const curY = gsap.getProperty(bottle, 'y');
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
                        end: '+=150%',
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

                return () => {
                    mm.revert();
                };
            });

            ScrollTrigger.refresh();
        };

        initScroll();

        return () => {
            isMounted = false;
            ScrollTrigger.removeEventListener('refresh', handleRefresh);

            if (locoScroll) {
                if (typeof locoScroll.destroy === 'function') {
                    locoScroll.destroy();
                }
                locoScroll = null;
            }

            ScrollTrigger.getAll().forEach((t) => t.kill());

            document.documentElement.classList.remove('has-scroll-smooth');
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';

            // Clean up GSAP vars
            gsap.set(document.body, { clearProps: 'all' });
            gsap.set(document.documentElement, { clearProps: 'all' });
        };
    }, []);
    return null;
}
