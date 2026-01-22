import { Button } from '@/components/ui/button';
import Header from '@/components/user/Header';
import Image from 'next/image';
import React from 'react';

export default function HomePage() {
    return (
        <div className="bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5] min-h-screen relative">
            <Header />
            <div className="wrapper pt-[210px] pb-[120px]">
                <div className="mb-[100px]">
                    <h2 className="text-[#4E3325] text-[72px] font-bricolage font-bold mb-[38px]">
                        Feel the <span className="title-highlight">Crunch.</span>
                        <br />
                        Taste the Luxury.
                    </h2>
                    <Button className="bg-linear-to-r from-[#caa45a] via-[#ddb56a] to-[#b08a43] h-[54px] w-[195px] font-medium">
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
                src="/images/user/crizbe-bg.png"
                alt="Crizbe"
                width={100}
                height={100}
                className="absolute w-full bottom-0"
            />
        </div>
    );
}
