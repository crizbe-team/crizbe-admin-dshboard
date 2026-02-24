'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { ImageParticles } from '@/components/user/ImageParticles';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import pistaBottle from '../../../public/images/user/pista-bottle.png';
import almondBottle from '../../../public/images/user/almond-bottle.png';
import hazelnutBottle from '../../../public/images/user/hazelnut-bottle.png';

const flavors = [
    {
        id: 'almond',
        name: 'Almond',
        image: almondBottle,
        alt: 'Crizbe Almond Premium Crunch Stick Bottle',
    },
    {
        id: 'pista',
        name: 'Pistachio',
        image: pistaBottle,
        alt: 'Crizbe Pista Premium Crunch Stick Bottle',
    },
    {
        id: 'hazelnut',
        name: 'Hazelnut',
        image: hazelnutBottle,
        alt: 'Crizbe Hazelnut Premium Crunch Stick Bottle',
    },
];

export default function NextFlavour() {
    const router = useRouter();
    const [selectedFlavor, setSelectedFlavor] = useState(flavors[1]); // Default to Pistachio

    return (
        <section className="min-h-screen flex justify-center next-flavour-section relative overflow-visible py-20 md:py-0 bg-transparent">
            <div className="wrapper flex flex-col md:flex-row gap-[60px] md:gap-[20px] justify-between items-center relative z-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-[#4E3325] text-[48px] md:text-[64px] font-bricolage font-bold mb-[38px] next-flavour-title leading-tight">
                        <div className="next-flavour-line inline-block">Find your</div> <br />
                        <div className="next-flavour-line inline-block">
                            next{' '}
                            <span className="title-highlights relative text-[#f9f1df]">
                                favorite
                            </span>
                        </div>
                        <br />
                        <div className="next-flavour-line inline-block">flavor</div>
                    </h2>
                </div>

                <div className="flex flex-col items-center gap-[40px] md:gap-[50px]">
                    <div
                        className="w-[180px] md:w-[230px] relative h-[300px] md:h-[450px] flex items-center justify-center mb-[45px]"
                        id="next-flavour-bottle-target"
                    >
                        <Image
                            id="next-pista-bottle"
                            src={selectedFlavor.image}
                            alt={selectedFlavor.alt}
                            width={230}
                            height={100}
                            priority
                            quality={100}
                            className="w-full h-auto opacity-0"
                        />
                    </div>

                    {/* Flavor Selection Buttons */}
                    <div className="flex gap-4 md:gap-6 flavor-selection-btns translate-y-[600px] invisible">
                        {flavors.map((flavor) => (
                            <button
                                key={flavor.id}
                                onClick={() => setSelectedFlavor(flavor)}
                                className={`w-[48px] md:w-[48px] h-[48px] md:h-[48px] rounded-full bg-white flex items-center justify-center p-2 pb-0 transition-all duration-300 shadow-xl cursor-pointer ${selectedFlavor.id === flavor.id
                                    ? 'ring-2 ring-[#C2A065] scale-110 shadow-[0_0_20px_rgba(194,160,101,0.4)] w-[64px] h-[64px]'
                                    : 'hover:ring-2 hover:ring-[#C2A065]/50 grayscale-[0.3] hover:grayscale-0'
                                    }`}
                            >
                                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={flavor.image}
                                        alt={flavor.name}
                                        width={40}
                                        height={60}
                                        className="object-contain h-full w-[120%]"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-[30px] md:gap-[50px]">
                    <div className="flex items-center next-flavour-card">
                        <Image
                            src="/images/user/line.svg"
                            alt="Decorative separator"
                            width={100}
                            height={100}
                            className="w-[100px] md:w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[16px] md:text-[18px] font-normal ml-4">
                            Crunchy outside, premium <br className="hidden md:block" />
                            cream inside
                        </p>
                    </div>
                    <div className="flex items-center next-flavour-card">
                        <Image
                            src="/images/user/line.svg"
                            alt="Decorative separator"
                            width={100}
                            height={100}
                            className="w-[100px] md:w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[16px] md:text-[18px] font-normal ml-4">
                            Deliciously crispy exterior <br className="hidden md:block" /> with rich{' '}
                            {selectedFlavor.id === 'pista' ? 'pistachio' : selectedFlavor.id}{' '}
                            filling.
                        </p>
                    </div>
                    <div className="flex items-center next-flavour-card">
                        <Image
                            src="/images/user/line.svg"
                            alt="Decorative separator"
                            width={100}
                            height={100}
                            className="w-[100px] md:w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[16px] md:text-[18px] font-normal ml-4">
                            Golden crunch shell <br className="hidden md:block" /> encasing velvety
                            caramel.
                        </p>
                    </div>
                    <div className="flex items-center next-flavour-card">
                        <Image
                            src="/images/user/line.svg"
                            alt="Decorative separator"
                            width={100}
                            height={100}
                            className="w-[100px] md:w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[16px] md:text-[18px] font-normal ml-4">
                            Premium nuts wrapped in
                            <br className="hidden md:block" /> Belgian chocolate
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
