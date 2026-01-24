import { ImageParticles } from '@/components/user/ImageParticles';
import Hero from '../_components/Hero';
import Flavours from '../_components/Flavours';
import NextFlavour from '../_components/NextFlavour';
import SmoothScroll from '@/components/SmoothScroll';

export default function Home() {
    return (
        <main className="smooth-scroll bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5]">
            <SmoothScroll />
            <Hero />
            <Flavours />
            <NextFlavour />
        </main>
    );
}
