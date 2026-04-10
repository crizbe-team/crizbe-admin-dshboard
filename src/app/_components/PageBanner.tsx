import React from 'react';

interface PageBannerProps {
    title: string;
    subtitle?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({ title, subtitle }) => {
    return (
        <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden bg-[#F9F2E0]">
            {/* Subtle organic shapes in background - similar to the image */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[150%] bg-[#E3D1A5]/20 rounded-full blur-[120px] transform -rotate-12" />
                <div className="absolute bottom-[-30%] right-[-5%] w-[50%] h-[120%] bg-[#C4994A]/10 rounded-full blur-[100px] transform rotate-45" />

                {/* Visual "waves" or swirly elements if possible with simple CSS */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E3D1A5]/30 rounded-full opacity-50 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C4994A]/20 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bricolage font-semibold text-[#552c10] tracking-tight leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-4 text-lg md:text-xl text-[#552c10]/60 font-medium">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
};

export default PageBanner;
