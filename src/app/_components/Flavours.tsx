import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

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
                    <div className="bg-[url(/images/user/almond-card.png)] relative bg-contain bg-no-repeat w-[600px] h-[360px] p-[42px] flex flex-col justify-end shrink-0">
                        <div className="w-[230px] absolute right-[70px] top-[50%] translate-y-[-50%] almond-bottle-target-position z-1">
                            <Image
                                id="almond-bottle-target"
                                src="/images/user/almond-bottle.png"
                                alt=""
                                width={100}
                                height={100}
                                className="w-full h-full invisible opacity-0"
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
                    </div>

                    {/* Hazelnut Card */}
                    <div className="bg-[url(/images/user/hazelnut-card.png)] relative bg-contain bg-no-repeat w-[600px] h-[360px] p-[42px] flex flex-col justify-end shrink-0">
                        <div className="w-[230px] absolute right-[70px] top-[50%] translate-y-[-50%] hazelnut-bottle-target-position z-1">
                            <Image
                                id="hazelnut-bottle-target"
                                src="/images/user/hazelnut-bottle.png"
                                alt=""
                                width={100}
                                height={100}
                                className="w-full h-full invisible opacity-0"
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
                    </div>

                    {/* Pista Card */}
                    <div className="bg-[url(/images/user/pista-card.png)] relative bg-contain bg-no-repeat w-[600px] h-[360px] p-[42px] flex flex-col justify-end shrink-0">
                        <div className="w-[230px] absolute right-[70px] top-[50%] translate-y-[-50%] pista-bottle-target-position z-1">
                            <Image
                                id="pista-bottle-target"
                                src="/images/user/pista-bottle.png"
                                alt=""
                                width={100}
                                height={100}
                                className="w-full h-full invisible opacity-0"
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
                    </div>
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
