
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
        <>
            {loading && <UserLoaders />}
            <main className="smooth-scroll bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
                <StructuredData />
                <SmoothScroll />
                <Hero />
                <Flavours />
                <NextFlavour />
                <QuoteSection />
                <FeedbacSection />
                <Footer />
            </main>
        </>

    );
}
