'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function SmoothScroll() {
    useEffect(() => {
        const initScroll = async () => {
            const LocomotiveScroll = (await import('locomotive-scroll')).default;
            const scrollContainer = document.querySelector('.smooth-scroll');
            gsap.registerPlugin(ScrollTrigger);

            if (!scrollContainer) return;

            const locoScroll = new LocomotiveScroll({
                el: scrollContainer,
                smooth: true,
                multiplier: 1,
            });

            locoScroll.on('scroll', ScrollTrigger.update);

            ScrollTrigger.scrollerProxy(scrollContainer, {
                scrollTop(value) {
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

            ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
            ScrollTrigger.defaults({ scroller: '.smooth-scroll' });

            ScrollTrigger.matchMedia({
                '(min-width: 1024px)': function () {
                    // const horizontalScrollWrapper = document.querySelector(
                    //     '.horizontal-scroll-wrapper'
                    // );
                    const almondBottle = document.querySelector('#almond-bottle');
                    const almondBottleTarget = document.querySelector(
                        '.almond-bottle-target-position'
                    );
                    // if (horizontalScrollWrapper) {
                    //     const scrollWidth = horizontalScrollWrapper.scrollWidth - window.innerWidth;
                    //     gsap.to(horizontalScrollWrapper, {
                    //         x: -scrollWidth,
                    //         ease: 'none',
                    //         scrollTrigger: {
                    //             trigger: '.second-section',
                    //             start: 'top top',
                    //             end: () => `+=${scrollWidth}`,
                    //             scrub: 1,
                    //             pin: true,
                    //             anticipatePin: 1,
                    //             invalidateOnRefresh: true,
                    //         },
                    //     });
                    // }
                    const tl1 = gsap.timeline({
                        scrollTrigger: {
                            trigger: '.flavours-section',
                            start: '20% 100%',
                            end: '50% 50%',
                            scrub: true,
                            invalidateOnRefresh: true,
                            // markers: true,
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
                },
            });
            ScrollTrigger.refresh();
            return () => {
                if (locoScroll) locoScroll.destroy();
                ScrollTrigger.getAll().forEach((t) => t.kill());
            };
        };
        initScroll();
    }, []);
    return null;
}
