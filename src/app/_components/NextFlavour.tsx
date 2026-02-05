import Image from 'next/image';
import React from 'react';
import pistaBottle from '../../../public/images/user/pista-bottle.png';

export default function NextFlavour() {
    return (
        <div className="h-screen flex justify-center next-flavour-section">
            <div className="wrapper flex gap-[20px] justify-between items-center">
                <h2 className="text-[#4E3325] text-[64px] font-bricolage font-bold mb-[38px] next-flavour-title">
                    <div className="next-flavour-line inline-block">Find your</div> <br />
                    <div className="next-flavour-line inline-block">
                        next{' '}
                        <span className="title-highlight after:bg-[#c2a065] text-[#f9f1df]">
                            favorite
                        </span>
                    </div>
                    <br />
                    <div className="next-flavour-line inline-block">flavor</div>
                </h2>
                <div className="w-[230px] relative h-full" id="next-flavour-bottle-target">
                    <Image
                        id="next-pista-bottle"
                        src={pistaBottle}
                        alt="Crizbe Pista Premium Crunch Stick Bottle - Next Flavor Discovery"
                        width={230}
                        height={100}
                        priority
                        quality={100}
                        className="w-full h-auto opacity-0"
                    />
                </div>
                <div>
                    <div className="flex items-center mb-[50px] next-flavour-card">
                        <Image
                            src="/images/user/line.svg"
                            alt="Decorative separator"
                            width={100}
                            height={100}
                            className="w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[18px] font-normal">
                            Crunchy outside, premium <br />
                            cream inside
                        </p>
                    </div>
                    <div className="flex items-center mb-[50px] next-flavour-card">
                        <Image
                            src="/images/user/line.svg"
                            alt="Decorative separator"
                            width={100}
                            height={100}
                            className="w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[18px] font-normal">
                            Deliciously crispy exterior <br /> with rich pista filling.
                        </p>
                    </div>
                    <div className="flex items-center mb-[50px] next-flavour-card">
                        <Image
                            src="/images/user/line.svg"
                            alt="Decorative separator"
                            width={100}
                            height={100}
                            className="w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[18px] font-normal">
                            Golden crunch shell <br /> encasing velvety caramel.
                        </p>
                    </div>
                    <div className="flex items-center next-flavour-card">
                        <Image
                            src="/images/user/line.svg"
                            alt="Decorative separator"
                            width={100}
                            height={100}
                            className="w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[18px] font-normal">
                            Premium nuts wrapped in
                            <br /> Belgian chocolate
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
