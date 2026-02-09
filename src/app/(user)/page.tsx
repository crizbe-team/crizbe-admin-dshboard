import { ImageParticles } from '@/components/user/ImageParticles';
import Hero from '../_components/Hero';
import QuoteSection from '../_components/QuoteSection';
import Flavours from '../_components/Flavours';
import NextFlavour from '../_components/NextFlavour';
import SmoothScroll from '@/components/SmoothScroll';
import StructuredData from '../_components/StructuredData';

export default function Home() {
    return (
        <main className="smooth-scroll bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
            <StructuredData />
            <SmoothScroll />
            <Hero />
            <Flavours />
            <NextFlavour />
            <QuoteSection />
        </main>
    );
}
