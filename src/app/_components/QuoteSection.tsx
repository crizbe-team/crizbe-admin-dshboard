import { ImageParticles } from '@/components/user/ImageParticles';
import React from 'react';

export default function QuoteSection() {
    return (
        <section className="quote-section relative bg-[url(/images/user/Vector.png)] bg-cover bg-no-repeat min-h-screen flex items-center overflow-hidden">
            {/* Scattered nuts overlay */}

            <div className="wrapper relative z-10 text-center px-4 quote-section-content">
                <h2 className="text-[#F9F2E0] text-[56px] md:text-[80px] lg:text-[120px] font-bricolage font-bold leading-tight">
                    &ldquo;We won&apos;t say much.&rdquo;
                    <br />
                    The <span className="title-qoutes-highlights text-[#CDAB78]">Crunch.</span>
                    <br className="md:hidden" /> will.
                </h2>
            </div>

            <ImageParticles
                className="absolute inset-0"
                images={[
                    '/images/user/almond-1.png',
                    '/images/user/pista-1.png',
                    '/images/user/hazelnut-1.png',
                    '/images/user/almond-2.png',
                    '/images/user/pista-2.png',
                    '/images/user/hazelnut-2.png',
                    '/images/user/almond-3.png',
                    '/images/user/pista-3.png',
                    '/images/user/hazelnut-3.png',
                    '/images/user/almond-4.png',
                    '/images/user/pista-4.png',
                    '/images/user/hazelnut-4.png',
                    '/images/user/almond-5.png',
                    '/images/user/pista-5.png',
                    '/images/user/hazelnut-5.png',
                    '/images/user/almond-6.png',
                    '/images/user/pista-6.png',
                    '/images/user/hazelnut-6.png',
                ]}
                quantity={18}
                size={30}
                staticity={12}
            />
        </section>
    );
}
