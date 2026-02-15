"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../../../public/images/user/crizbe-logo.svg"

export default function UserLoaders() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // loader time (2 seconds)

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
            <div className="animate-pulse">
                <Image
                    src={logo} // change to your logo path
                    alt="Logo"
                    width={150}
                    height={150}
                />
            </div>
        </div>
    );
}
