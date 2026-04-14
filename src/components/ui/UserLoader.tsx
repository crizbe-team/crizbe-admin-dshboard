'use client';

import Image from 'next/image';
import logo from '../../../public/images/user/crizbe-logo.svg';

export default function UserLoaders({ className }: { className?: string }) {
    return (
        <div
            className={`fixed inset-0 bg-white flex items-center justify-center z-[9999] ${className}`}
        >
            <div className="animate-pulse">
                <Image src={logo} alt="Logo" width={150} height={150} />
            </div>
        </div>
    );
}
