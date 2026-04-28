'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';
import pistaBottle from '../../../public/images/user/pista-bottle.png';
import { useRouter } from 'next/navigation';

export default function ResponsiveFlavours() {
    const router = useRouter();

    return (
        <section className="flavours-section-mobile py-[60px] px-4 flex flex-col items-center relative z-10 overflow-hidden bg-[url(/images/user/flavours-bg.png)] bg-[length:100%_100%] bg-no-repeat">
            <div className="text-center mb-[40px] mt-[20px] relative z-20">
                <h2 className="text-[#4E3325] text-[32px] sm:text-[36px] leading-[1.2] font-bricolage font-bold mb-4">
                    3 Flavours. One <br />
                    Perfect{' '}
                    <span className="title-highlighter after:bg-[#c2a065] text-[#CDAB78] relative px-1">
                        Crunch.
                    </span>
                </h2>
                <Button className="bg-[#FAF3E2] h-[44px] w-[140px] hover:bg-black/5 focus-visible:border-[#C4994A] outline-none transition disabled:opacity-50 group rounded-full mt-2">
                    <span
                        className="font-medium text-[15px] bg-[linear-gradient(88.77deg,#9A7236_-7.08%,#E8BF7A_31.99%,#C4994A_68.02%,#937854_122.31%)] bg-clip-text text-transparent group-hover:text-white group-hover:bg-none"
                        onClick={() => router.push('/products')}
                    >
                        Get it Now
                    </span>
                </Button>
            </div>

            <div className="flex flex-col gap-[60px] sm:gap-[70px] w-full max-w-[340px] sm:max-w-[420px] mt-[30px] mb-[40px] relative z-20">
                {/* Almond Card */}
                <article className="relative w-full aspect-[600/360]">
                    <div className="absolute inset-0 bg-[url(/images/user/almond-card.png)] bg-[length:100%_100%] bg-no-repeat w-full h-full rounded-[16px] sm:rounded-[20px]"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-[10%] z-10">
                        <h2 className="text-[#5C4114] text-[24px] sm:text-[26px] font-bricolage font-semibold mb-[4px]">
                            Almond
                        </h2>
                        <p className="text-[#4E3325CC] text-[14px] sm:text-[14px] leading-[1.3] font-normal max-w-[140px] sm:max-w-[170px]">
                            Feel the premium almond crunch in every byte.
                        </p>
                    </div>
                    <Image
                        src="/images/user/almond-bottle.png"
                        alt="Crizbe Almond Premium Crunch Stick Bottle"
                        width={230}
                        height={600}
                        priority
                        quality={100}
                        className="absolute right-[0%] sm:right-[5%] top-1/2 -translate-y-1/2 h-[120%] w-auto object-contain drop-shadow-2xl z-20 pointer-events-none"
                    />
                </article>

                {/* Hazelnut Card */}
                <article className="relative w-full aspect-[600/360]">
                    <div className="absolute inset-0 bg-[url(/images/user/hazelnut-card.png)] bg-[length:100%_100%] bg-no-repeat w-full h-full rounded-[16px] sm:rounded-[20px]"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-[10%] z-10">
                        <h2 className="text-[#FFFFFF] text-[24px] sm:text-[26px] font-bricolage font-semibold mb-[4px]">
                            Hazelnut
                        </h2>
                        <p className="text-[#FFFFFF] text-[14px] sm:text-[14px] leading-[1.3] font-normal max-w-[140px] sm:max-w-[170px]">
                            Feel the premium hazelnut crunch in every byte.
                        </p>
                    </div>
                    <Image
                        src="/images/user/hazelnut-bottle.png"
                        alt="Crizbe Hazelnut Premium Crunch Stick Bottle"
                        width={230}
                        height={600}
                        priority
                        quality={100}
                        className="absolute right-[0%] sm:right-[5%] top-1/2 -translate-y-1/2 h-[120%] w-auto object-contain drop-shadow-2xl z-20 pointer-events-none"
                    />
                </article>

                {/* Pista Card */}
                <article className="relative w-full aspect-[600/360]">
                    <div className="absolute inset-0 bg-[url(/images/user/pista-card.png)] bg-[length:100%_100%] bg-no-repeat w-full h-full rounded-[16px] sm:rounded-[20px]"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-[10%] z-10">
                        <h2 className="text-[#FFFFFF] text-[24px] sm:text-[26px] font-bricolage font-semibold mb-[4px]">
                            Pistachio
                        </h2>
                        <p className="text-[#FFFFFF] text-[14px] sm:text-[14px] leading-[1.3] font-normal max-w-[140px] sm:max-w-[170px]">
                            Feel the premium pista crunch in every byte.
                        </p>
                    </div>
                    <Image
                        src={pistaBottle}
                        alt="Crizbe Pista Premium Crunch Stick Bottle"
                        width={230}
                        height={600}
                        priority
                        quality={100}
                        className="absolute right-[0%] sm:right-[5%] top-1/2 -translate-y-1/2 h-[120%] w-auto object-contain drop-shadow-2xl z-20 pointer-events-none"
                    />
                </article>
            </div>

            <div className="mt-[20px] w-full flex justify-center z-10">
                <Button className="view-all-btn bg-[#4E3325] hover:bg-[#3d281d] text-white rounded-full text-[14px] font-medium flex items-center gap-[10px] h-[48px] px-6">
                    View all products{' '}
                    <Image
                        src="/images/user/arrow-right.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="w-[14px]"
                    />
                </Button>
            </div>
        </section>
    );
}
