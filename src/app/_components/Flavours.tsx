import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

const ingredientsConfig = [
    { size: 50, blur: 'blur-[4px]', z: 'z-1', delay: '0.1s' }, // Back far
    { size: 35, blur: 'blur-none', z: 'z-1', delay: '0.05s' }, // Front sharp
    { size: 45, blur: 'blur-[1px]', z: 'z-1', delay: '0.15s' }, // Mid soft
    { size: 30, blur: 'blur-[2px]', z: 'z-1', delay: '0.2s' }, // Back small
    { size: 55, blur: 'blur-[1px]', z: 'z-1', delay: '0.12s' }, // Front large
    { size: 40, blur: 'blur-none', z: 'z-1', delay: '0.18s' }, // Mid sharp
];

export default function Flavours() {
    return (
        <section className="flavours-section bg-[url(/images/user/flavours-bg.png)] bg-contain bg-no-repeat bg-left min-h-screen flex items-center overflow-visible">
            <div className="horizontal-scroll-wrapper flex gap-[100px] items-center px-[5vw] pr-[10vw]">
                <div className="shrink-0">
                    <h2 className="text-[#4E3325] text-[64px] font-bricolage font-bold mb-[38px]">
                        3 Flavours. One <br />
                        Perfect{' '}
                        <span className="title-highlight after:bg-[#c2a065] text-[#f9f1df]">
                            Crunch.
                        </span>
                    </h2>
                    <Button className="bg-linear-to-r from-[#caa45a] via-[#ddb56a] to-[#b08a43] h-[54px] w-[195px] font-medium">
                        Discover the Crunch
                    </Button>
                </div>

                <div className="flex gap-[40px] items-center">
                    {/* Almond Card */}
                    <article className="group bg-[url(/images/user/almond-card.png)] relative bg-contain bg-no-repeat w-[600px] h-[360px] p-[42px] flex flex-col justify-end shrink-0 transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02]">
                        <div className="w-[230px] absolute right-[70px] top-[50%] translate-y-[-50%] almond-bottle-target-position z-10 flex items-center justify-center">
                            {/* Ingredient Orbits */}
                            {ingredientsConfig.map((config, i) => (
                                <Image
                                    key={i}
                                    src={`/images/user/almond-${i + 1}.png`}
                                    alt="Almond piece for Crizbe Almond Crunch Stick"
                                    width={config.size}
                                    height={config.size}
                                    quality={100}
                                    style={{
                                        transitionDelay: config.delay,
                                        transitionTimingFunction:
                                            'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    }}
                                    className={`absolute pointer-events-none transition-all duration-700 opacity-0 scale-0 ingredient-orbit-${i + 1} group-hover:opacity-100 group-hover:scale-100 ${config.blur} ${config.z} drop-shadow-2xl`}
                                />
                            ))}

                            <Image
                                id="almond-bottle-target"
                                src="/images/user/almond-bottle.png"
                                alt="Crizbe Almond Premium Crunch Stick Bottle"
                                width={100}
                                height={100}
                                className="w-full h-full invisible opacity-0 relative z-10"
                            />
                        </div>
                        <div className="parallax-content">
                            <h2 className="text-[#5C4114] text-[40px] font-bricolage font-semibold mb-[10px]">
                                Almond
                            </h2>
                            <p className="text-[#4E3325CC] text-[16px] font-normal">
                                Feel the premium almond <br />
                                crunch in every byte.
                            </p>
                        </div>
                    </article>

                    {/* Hazelnut Card */}
                    <article className="group bg-[url(/images/user/hazelnut-card.png)] relative bg-contain bg-no-repeat w-[600px] h-[360px] p-[42px] flex flex-col justify-end shrink-0 transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02]">
                        <div className="w-[230px] absolute right-[70px] top-[50%] translate-y-[-50%] hazelnut-bottle-target-position z-10 flex items-center justify-center">
                            {/* Ingredient Orbits */}
                            {ingredientsConfig.map((config, i) => (
                                <Image
                                    key={i}
                                    src={`/images/user/hazelnut-${i + 1}.png`}
                                    alt="Hazelnut piece for Crizbe Hazelnut Crunch Stick"
                                    width={config.size}
                                    height={config.size}
                                    quality={100}
                                    style={{
                                        transitionDelay: config.delay,
                                        transitionTimingFunction:
                                            'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    }}
                                    className={`absolute pointer-events-none transition-all duration-700 opacity-0 scale-0 ingredient-orbit-${i + 1} group-hover:opacity-100 group-hover:scale-100 ${config.blur} ${config.z} drop-shadow-2xl`}
                                />
                            ))}

                            <Image
                                id="hazelnut-bottle-target"
                                src="/images/user/hazelnut-bottle.png"
                                alt="Crizbe Hazelnut Premium Crunch Stick Bottle"
                                width={100}
                                height={100}
                                className="w-full h-full invisible opacity-0 relative z-10"
                            />
                        </div>
                        <div className="parallax-content">
                            <h2 className="text-[#FFFFFF] text-[40px] font-bricolage font-semibold mb-[10px]">
                                Hazelnut
                            </h2>
                            <p className="text-[#FFFFFF] text-[16px] font-normal">
                                Indulge in the rich <br />
                                hazelnut center.
                            </p>
                        </div>
                    </article>

                    {/* Pista Card */}
                    <article className="group bg-[url(/images/user/pista-card.png)] relative bg-contain bg-no-repeat w-[600px] h-[360px] p-[42px] flex flex-col justify-end shrink-0 transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02]">
                        <div className="w-[230px] absolute right-[70px] top-[50%] translate-y-[-50%] pista-bottle-target-position z-10 flex items-center justify-center">
                            {/* Ingredient Orbits */}
                            {ingredientsConfig.map((config, i) => (
                                <Image
                                    key={i}
                                    src={`/images/user/pista-${i + 1}.png`}
                                    alt="Pistachio piece for Crizbe Pista Crunch Stick"
                                    width={config.size}
                                    height={config.size}
                                    quality={100}
                                    style={{
                                        transitionDelay: config.delay,
                                        transitionTimingFunction:
                                            'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    }}
                                    className={`absolute pointer-events-none transition-all duration-700 opacity-0 scale-0 ingredient-orbit-${i + 1} group-hover:opacity-100 group-hover:scale-100 ${config.blur} ${config.z} drop-shadow-2xl`}
                                />
                            ))}

                            <Image
                                id="pista-bottle-target"
                                src="/images/user/pista-bottle.png"
                                alt="Crizbe Pista Premium Crunch Stick Bottle"
                                width={100}
                                height={100}
                                className="w-full h-full invisible opacity-0 relative z-10"
                            />
                        </div>
                        <div className="parallax-content">
                            <h2 className="text-[#FFFFFF] text-[40px] font-bricolage font-semibold mb-[10px]">
                                Pista
                            </h2>
                            <p className="text-[#FFFFFF] text-[16px] font-normal">
                                Savor the roasted <br />
                                pistachio perfection.
                            </p>
                        </div>
                    </article>
                </div>
            </div>
            <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 z-10">
                <Button className="view-all-btn bg-[#4E3325] hover:bg-[#3d281d] text-white rounded-full text-[16px] font-medium flex items-center gap-[10px] translate-y-[600px] invisible">
                    View all products{' '}
                    <Image
                        src="/images/user/arrow-right.svg"
                        alt=""
                        width={100}
                        height={100}
                        className="w-[16px]"
                    />
                </Button>
            </div>
        </section>
    );
}
