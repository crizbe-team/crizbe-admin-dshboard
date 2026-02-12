import React from 'react';


export default function QuoteSection() {
    return (
        <section className="flavours-section bg-[url(/images/user/Vector.png)]  bg-cover bg-no-repeat min-h-screen flex items-center overflow-visible">
            {/* Scattered nuts overlay */}

            <div className="wrapper relative z-10 text-center px-4">
                <h2 className="text-[#F9F2E0] text-[120px] font-bricolage font-bold leading-tight">
                    &ldquo;We won&apos;t say much.&rdquo;
                    <br />
                    The{' '}
                    <span className="title-qoutes-highlights  text-[#CDAB78]">
                        Crunch.
                    </span>
                    will.
                </h2>
            </div>
        </section>
    );
}
