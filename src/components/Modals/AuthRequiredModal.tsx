import React, { useId } from 'react';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ModalWrapper } from '@/components/ui/ModalWrapper';

export default function AuthRequiredModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const titleId = useId();

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                className="relative w-screen h-screen md:w-[440px] border border-[#E8DCC4]/60 bg-[#FFFFFF] md:rounded-[32px] md:h-auto overflow-hidden flex flex-col justify-center shadow-2xl"
                style={{
                    willChange: 'transform, opacity', // Hardware acceleration hint
                }}
            >
                {/* Soft top lighting effect - using simple linear gradient */}
                <div className="absolute top-0 inset-x-0 h-[150px] bg-linear-to-b from-[#FAF5E8] to-transparent pointer-events-none" />

                <div className="px-10 pt-12 pb-10 flex flex-col items-center text-center relative z-10">
                    {/* Luxurious Icon Container */}
                    <div className="relative w-[72px] h-[72px] mb-8">
                        {/* Outer Glow - Using radial gradient instead of expensive CSS blur */}
                        <div className="absolute inset-[-50%] bg-[radial-gradient(circle,rgba(196,153,74,0.12)_0%,transparent_60%)] pointer-events-none rounded-full" />

                        {/* Inner Circle */}
                        <div className="absolute inset-0 rounded-full border border-[#FFF] shadow-[0_4px_12px_rgba(196,153,74,0.15)] flex items-center justify-center bg-linear-to-br from-[#FFFFFF] to-[#FDF8F0]">
                            <LogIn className="w-8 h-8 text-[#9A7236]" strokeWidth={1.5} />
                        </div>
                    </div>

                    <span className="font-inter-tight font-semibold text-[11px] uppercase tracking-[0.25em] text-[#C4994A] mb-4">
                        Members Only
                    </span>

                    <h2
                        id={titleId}
                        className="font-bricolage text-[28px] font-bold text-[#1A1A1A] mb-3 leading-tight tracking-tight"
                    >
                        Authentication Required
                    </h2>

                    <p className="text-[15px] leading-relaxed text-[#5A5A5A] mb-10 max-w-[280px]">
                        Please sign in to your account or register to secure your selection.
                    </p>

                    <div className="flex flex-col w-full gap-3 transform-gpu">
                        <button
                            onClick={() => {
                                onClose();
                                router.push('/login');
                            }}
                            className="group w-full relative overflow-hidden h-[54px] rounded-[16px] flex items-center justify-center font-inter-tight font-medium text-[16px] text-white transition-all duration-300 cursor-pointer shadow-[0_4px_12px_rgba(196,153,74,0.3)] hover:shadow-[0_6px_16px_rgba(196,153,74,0.4)]"
                            style={{
                                background:
                                    'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-700 group-hover:left-full ease-out" />
                            <span className="relative z-10">Sign In</span>
                        </button>

                        <button
                            onClick={() => {
                                onClose();
                                router.push('/register');
                            }}
                            className="w-full h-[54px] rounded-[16px] border border-[#E7E4DD] bg-white flex items-center justify-center font-inter-tight font-medium text-[16px] text-[#474747] hover:border-[#C4994A] hover:bg-[#FFF9F0] hover:text-[#191919] transition-all duration-300 cursor-pointer"
                        >
                            Create an Account
                        </button>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
}
