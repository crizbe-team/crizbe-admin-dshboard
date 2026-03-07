import { Button } from '@/components/ui/button';
import Header from '@/components/user/Header';
import { ImageParticles } from '@/components/user/ImageParticles';
import Image from 'next/image';
import React from 'react';
import pistaBottle from '../../../public/images/user/pista-bottle.png';

export default function Hero() {
    return (
        <div className="min-h-screen relative bg-transparent">
            {/* <Header /> */}
            <div className="wrapper pt-[210px] pb-[120px] relative">
                <div className="mb-[100px]">
                    <h1 className="text-[#4E3325] text-[72px] font-bricolage font-bold mb-[38px]">
                        Feel the{' '}
                        <span className="title-highlight after:bg-[#c2a065] text-[#f9f1df]">
                            Crunch.
                        </span>
                        <br />
                        Taste the Luxury.
                    </h1>
                    <Button style={{
                        background:
                            'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                    }}
                        className="transition-all duration-300 ease-out hover:scale-[1.02] whitespace-nowrap py-3 group relative overflow-hidden mb-[16px] shadow-sm hover:opacity-95 active:opacity-90  h-[54px] w-[195px] font-medium">
                        <span className="pointer-events-none absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />
                        Discover the Crunch
                    </Button>
                </div>
                <p className="text-[#4E3325] text-[18px] font-normal">
                    A slender, perfectly layered crunch stick crafted with <br /> real hazelnut,
                    pistachio, and almond—where texture <br />
                    meets indulgence in every bite.
                </p>
            </div>
            <Image
                src="/images/user/almond-bottle.png"
                alt="Crizbe Almond Premium Crunch Stick Bottle"
                width={230}
                height={100}
                priority
                quality={100}
                id="almond-bottle"
                className="absolute z-[9999]  bottom-0 -rotate-[28.55deg] left-[45%] top-[60%]"
            />
            <Image
                src="/images/user/hazelnut-bottle.png"
                alt="Crizbe Hazelnut Premium Crunch Stick Bottle"
                width={230}
                height={100}
                priority
                quality={100}
                id="hazelnut-bottle"
                className="absolute z-[9999]  bottom-0 -rotate-[17.64deg] left-[65%] top-[50%]"
            />
            <Image
                src={pistaBottle}
                alt="Crizbe Pista Premium Crunch Stick Bottle"
                width={230}
                height={100}
                priority
                quality={100}
                id="pista-bottle"
                className="absolute z-[999]  bottom-0 -rotate-[7.5deg] left-[83%] top-[25%]"
            />
            {/* <Image
                src="/images/user/crizbe-bg.png"
                alt="Crizbe"
                width={100}
                height={100}
                className="absolute w-full bottom-0"
            /> */}
            <ImageParticles
                className="absolute inset-0"
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
                    '/images/user/almond-4.png',
                    '/images/user/pista-4.png',
                    '/images/user/hazelnut-4.png',
                    '/images/user/almond-5.png',
                    '/images/user/pista-5.png',
                    '/images/user/hazelnut-5.png',
                    '/images/user/almond-6.png',
                    '/images/user/pista-6.png',
                    '/images/user/hazelnut-6.png',
                ]}
                quantity={18}
                size={30}
                staticity={12}
            />
        </div>
    );
}
