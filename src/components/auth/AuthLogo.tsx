'use client';

import Link from 'next/link';
import Image from 'next/image';

interface AuthLogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export default function AuthLogo({
    className = 'flex justify-center mb-8',
    width = 150,
    height = 60,
}: AuthLogoProps) {
    return (
        <div className={className}>
            <Link href="/" className="cursor-pointer">
                <Image
                    src="/images/user/crizbe-logo.svg"
                    alt="Crizbe"
                    width={width}
                    height={height}
                    priority
                />
            </Link>
        </div>
    );
}
