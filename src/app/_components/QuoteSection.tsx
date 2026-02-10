import React from 'react';


export default function QuoteSection() {
    return (
        <section className="flavours-section bg-[url(/images/user/Vector.png)]  bg-cover bg-no-repeat min-h-screen flex items-center overflow-visible">
            {/* Scattered nuts overlay */}

            <div className="wrapper relative z-10 text-center px-4">
                <h2 className="text-white text-[clamp(2.5rem,6vw,4.5rem)] font-bricolage font-bold leading-tight">
                    &ldquo;We won&apos;t say much.&rdquo;
                    <br />
                    The{' '}
                    <span className="title-highlight after:bg-[#c2a065] text-[#f9f1df]">
                        Crunch.
                    </span>
                    will.
                </h2>
            </div>
        </section>
    );
}
