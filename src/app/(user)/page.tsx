
"use client"
import { ImageParticles } from '@/components/user/ImageParticles';
import Hero from '../_components/Hero';
import QuoteSection from '../_components/QuoteSection';
import Flavours from '../_components/Flavours';
import NextFlavour from '../_components/NextFlavour';
import SmoothScroll from '@/components/SmoothScroll';
import StructuredData from '../_components/StructuredData';
import FeedbacSection from '../_components/FeedbacSection';
import Footer from '../_components/Footer';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import UserLoaders from '@/components/ui/UserLoader';

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            setLoading(false);
        };

        if (document.readyState === "complete") {
            setLoading(false);
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);
    return (
        <div className="relative min-h-screen overflow-x-hidden">
            {loading && <UserLoaders />}

            {/* Layer 0: Global Background Gradient */}
            <div className="fixed inset-0 z-0 bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]" />

            {/* Layer 1: Parallax Background Image */}
            <Image
                src="/images/user/crizbe-bg.png"
                alt="Crizbe"
                width={100}
                height={100}
                sizes="100vw"
                className="fixed w-full bottom-0 pointer-events-none z-[1]"
                priority
            />

            {/* Layer 2: Main Content (Locomotive Scroll Container) */}
            <main className="smooth-scroll relative z-[2] bg-transparent">
                <StructuredData />
                <SmoothScroll />
                <Hero />
                <Flavours />
                <NextFlavour />
                <QuoteSection />
                <FeedbacSection />
                <Footer />
            </main>
        </div>
    );
}
