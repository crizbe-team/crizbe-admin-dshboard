import Image from 'next/image';
import React from 'react';

export default function NextFlavour() {
    return (
        <div className="h-screen flex justify-center next-flavour-section">
            <div className="wrapper flex gap-[20px] justify-between items-center">
                <h2 className="text-[#4E3325] text-[64px] font-bricolage font-bold mb-[38px]">
                    Find your <br />
                    next{' '}
                    <span className="title-highlight after:bg-[#c2a065] text-[#f9f1df]">
                        favorite
                    </span>
                    <br />
                    flavor
                </h2>
                <div className="w-[230px]" id="next-flavour-bottle-target">
                    <Image
                        src="/images/user/pista-bottle.png"
                        alt=""
                        width={100}
                        height={100}
                        className="w-full h-full"
                    />
                </div>
                <div>
                    <div className="flex items-center mb-[50px]">
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={100}
                            height={100}
                            className="w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[18px] font-normal">
                            Crunchy outside, premium <br />
                            cream inside
                        </p>
                    </div>
                    <div className="flex items-center mb-[50px]">
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={100}
                            height={100}
                            className="w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[18px] font-normal">
                            Deliciously crispy exterior <br /> with rich pista filling.
                        </p>
                    </div>
                    <div className="flex items-center mb-[50px]">
                        <Image
                            src="/images/user/line.svg"
                            alt=""
                            width={100}
                            height={100}
                            className="w-[140px]"
                        />
                        <p className="text-[#4E3325] text-[18px] font-normal">
                            Golden crunch shell <br /> encasing velvety caramel.
                        </p>
                    </div>
                    <div className="flex items-center">
                        <Image
                            src="/images/user/line.svg"
                            alt=""
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
