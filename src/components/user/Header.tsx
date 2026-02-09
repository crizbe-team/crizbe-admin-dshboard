import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full h-[80px] backdrop-blur-md bg-white/10 border-b border-white/20">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
                <h1 className="text-lg font-semibold text-white w-[150px]">
                    <Link href="/">
                        <Image
                            src="/images/user/crizbe-logo.svg"
                            alt="Logo"
                            width={200}
                            height={100}
                            priority
                            quality={100}

                        />
                    </Link>
                </h1>
                <button className="flex h-[10px] w-[32px] flex-col justify-between cursor-pointer">
                    <span className="h-[3px] w-full rounded bg-[#4E3325]"></span>
                    <span className="h-[3px] w-full rounded bg-[#4E3325]"></span>
                </button>
            </div>
        </header>
    );
}
