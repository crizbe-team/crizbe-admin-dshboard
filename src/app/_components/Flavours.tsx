import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

export default function Flavours() {
    return (
        <section className="py-[50px] flavours-section">
            <div className="bg-[url(/images/user/flavours-bg.png)] bg-contain bg-no-repeat bg-left py-[205px]">
                <div className="wrapper flex justify-between items-center">
                    <div>
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
                    <div className="bg-[url(/images/user/almond-card.png)] relative bg-contain bg-no-repeat w-[600px] h-[360px] p-[42px] flex flex-col justify-end">
                        <div className="w-[230px] bg-[#000] absolute right-[70px] top-[50%] translate-y-[-50%] almond-bottle-target-position">
                            <Image
                                src="/images/user/almond-bottle.png"
                                alt=""
                                width={100}
                                height={100}
                                className="w-full h-full invisible"
                            />
                        </div>
                        <h2 className="text-[#5C4114] text-[40px] font-bricolage font-semibold mb-[10px]">
                            Almond
                        </h2>
                        <p className="text-[#4E3325CC] text-[16px] font-normal">
                            Feel the premium almond <br />
                            crunch in every byte.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
