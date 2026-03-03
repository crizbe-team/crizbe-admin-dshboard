'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GoldenButton from '@/components/ui/GoldenButton';

export default function EnterOtpPage() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [isPending, setIsPending] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow single digit
        if (value.length > 1) {
            value = value.slice(-1);
        }
        
        // Only allow numbers
        if (value && !/^\d$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setErrorMsg('');

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        
        // Move to next input on arrow right
        if (e.key === 'ArrowRight' && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
        
        // Move to previous input on arrow left
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        
        if (!/^\d+$/.test(pastedData)) {
            return;
        }

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length && i < 4; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        
        // Focus the next empty input or the last one
        const nextEmptyIndex = newOtp.findIndex(digit => !digit);
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus();
        } else {
            inputRefs.current[3]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        const otpValue = otp.join('');
        
        if (otpValue.length !== 4) {
            setErrorMsg('Please enter the complete OTP');
            return;
        }

        setIsPending(true);
        
        // TODO: Implement OTP verification API call
        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // On success, redirect to next step
            router.push('/');
        } catch (error) {
            setErrorMsg('Invalid OTP. Please try again.');
        } finally {
            setIsPending(false);
        }
    };

    const handleResendCode = () => {
        if (resendTimer > 0) return;
        
        // TODO: Implement resend OTP API call
        console.log('Resending OTP...');
        setResendTimer(30); // 30 second cooldown
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-8">
                <Image
                    src="/images/user/crizbe-logo.svg"
                    alt="Crizbe"
                    width={150}
                    height={60}
                    priority
                />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-[#4E3325] mb-3">
                    Enter OTP
                </h1>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                    Enter the otp received on your email or
                    <br />
                    mobile number & continue
                </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                        {errorMsg}
                    </div>
                )}

                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className="w-16 h-16 text-center text-2xl font-semibold text-[#4E3325] border border-[#E7E4DD] rounded-lg bg-white outline-none hover:border-[#C4994A] focus:border-[#C4994A] transition-colors"
                            autoComplete="one-time-code"
                        />
                    ))}
                </div>

                {/* Resend Code */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[#7A7A7A]">Don&apos;t get the code?</span>
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendTimer > 0}
                        className={`font-medium transition-colors ${
                            resendTimer > 0 
                                ? 'text-[#B7AFA5] cursor-not-allowed' 
                                : 'text-[#C4994A] hover:text-[#B38840]'
                        }`}
                    >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                    </button>
                </div>

                {/* Continue Button */}
                <GoldenButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Verifying..."
                    fullWidth
                    className="rounded-full py-3"
                >
                    Continue
                </GoldenButton>
            </form>

            {/* Change Email/Phone Link */}
            <p className="mt-8 text-center">
                <Link
                    href="/register"
                    className="text-sm text-[#C4994A] hover:text-[#B38840] font-medium transition-colors"
                >
                    Change email / phone number
                </Link>
            </p>
        </div>
    );
}
