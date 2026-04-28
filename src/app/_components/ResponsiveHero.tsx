import { ButtonLink } from '@/components/ui/LinkButton';
import { ImageParticles } from '@/components/user/ImageParticles';
import Image from 'next/image';
import React from 'react';
import pistaBottle from '../../../public/images/user/pista-bottle.png';

export default function ResponsiveHero() {
    return (
        <div className="min-h-screen relative bg-transparent overflow-hidden flex flex-col pt-[120px] pb-[40px] px-4">
            <div className="wrapper relative z-10 text-center flex flex-col items-center">
                <div className="mb-[40px]">
                    <h1 className="text-[#4E3325] text-[48px] leading-[1.1] font-bricolage font-bold mb-[24px]">
                        Feel the{' '}
                        <span className="title-highlight after:bg-[#c2a065] text-[#f9f1df] px-2">
                            Crunch.
                        </span>
                        <br />
                        Taste the Luxury.
                    </h1>

                    <p className="text-[#4E3325] text-[14px] font-normal mb-[32px] max-w-[320px] mx-auto leading-relaxed">
                        A slender, perfectly layered crunch stick crafted with real hazelnut,
                        pistachio, and almond—where texture meets indulgence in every bite.
                    </p>

                    <ButtonLink
                        href="/products"
                        style={{
                            background:
                                'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                        }}
                        className="transition-all z-1 duration-300 ease-out hover:scale-[1.02] whitespace-nowrap py-3 group relative overflow-hidden shadow-sm hover:opacity-95 active:opacity-90 h-[54px] w-[195px] font-medium mx-auto flex items-center justify-center rounded-full"
                    >
                        <span className="pointer-events-none absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />
                        Discover the Crunch
                    </ButtonLink>
                </div>
            </div>

            <div className="relative flex-grow min-h-[300px] sm:min-h-[400px] w-full max-w-[400px] mx-auto mt-4 mb-8">
                {/* Pistachio (Back) */}
                <Image
                    src={pistaBottle}
                    alt="Crizbe Pista Premium Crunch Stick Bottle"
                    width={230}
                    height={100}
                    priority
                    quality={100}
                    className="absolute z-[10] bottom-[25%] sm:bottom-[30%] -rotate-[8deg] right-[-4%] sm:right-[0%] w-[32%] max-w-[130px] h-auto drop-shadow-[0_8px_10px_rgba(0,0,0,0.1)]"
                />

                {/* Hazelnut (Middle) */}
                <Image
                    src="/images/user/hazelnut-bottle.png"
                    alt="Crizbe Hazelnut Premium Crunch Stick Bottle"
                    width={230}
                    height={100}
                    priority
                    quality={100}
                    className="absolute z-[20] bottom-[0%] sm:bottom-[5%] -rotate-[18deg] left-[36%] w-[33%] max-w-[135px] h-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
                />

                {/* Almond (Front) */}
                <Image
                    src="/images/user/almond-bottle.png"
                    alt="Crizbe Almond Premium Crunch Stick Bottle"
                    width={230}
                    height={100}
                    priority
                    quality={100}
                    className="absolute z-[30] bottom-[2%] sm:bottom-[7%] -rotate-[26deg] left-[-4%] w-[32%] max-w-[130px] h-auto drop-shadow-[0_15px_20px_rgba(0,0,0,0.2)]"
                />
            </div>

            <ImageParticles
                className="absolute inset-0 pointer-events-none"
                images={[
                    '/images/user/almond-1.png',
                    '/images/user/pista-1.png',
                    '/images/user/hazelnut-1.png',
                    '/images/user/almond-2.png',
                    '/images/user/pista-2.png',
                    '/images/user/hazelnut-2.png',
                    '/images/user/almond-3.png',
                    '/images/user/pista-3.png',
                    '/images/user/hazelnut-3.png',
                ]}
                quantity={10}
                size={24}
                staticity={15}
            />
        </div>
    );
}
