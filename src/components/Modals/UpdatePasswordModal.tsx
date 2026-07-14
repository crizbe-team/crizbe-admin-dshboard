'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import GoldenButton from '@/components/ui/GoldenButton';
import { useForgotPassword, useVerifyOtp, useSetPassword } from '@/queries/use-auth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Eye, EyeOff, Check, X, Loader2, CheckCircle2 } from 'lucide-react';
import { passwordSchema } from '@/validations/auth';
import { toast } from '@/components/ui/Toast';

interface UpdatePasswordModalProps {
    open: boolean;
    onClose: () => void;
    email: string;
}

type Step = 'CONFIRM' | 'OTP' | 'PASSWORD' | 'SUCCESS';

export default function UpdatePasswordModal({ open, onClose, email }: UpdatePasswordModalProps) {
    const [step, setStep] = useState<Step>('CONFIRM');
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [resetToken, setResetToken] = useState<string>('');
    const [resendTimer, setResendTimer] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string>('');

    // Passwords state
    const [password, setPasswordState] = useState('');
    const [confirmPassword, setConfirmPasswordState] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string>('');

    // OTP Input Refs
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Mutations
    const { mutate: forgotPassword, isPending: isSendingOtp } = useForgotPassword();
    const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();
    const { mutate: setPasswordApi, isPending: isSettingPassword } = useSetPassword();

    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isSending, setIsSending] = useState(false);

    // Reset modal state when opened
    useEffect(() => {
        if (open) {
            setStep('CONFIRM');
            setOtp(['', '', '', '']);
            setResetToken('');
            setResendTimer(0);
            setErrorMsg('');
            setPasswordState('');
            setConfirmPasswordState('');
            setPasswordError('');
            setIsSending(false);
        }
    }, [open]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Focus first OTP input when step transitions to OTP
    useEffect(() => {
        if (step === 'OTP') {
            setTimeout(() => {
                otpInputRefs.current[0]?.focus();
            }, 100);
        }
    }, [step]);

    // Password strength logic
    const getPasswordRequirements = (pwd: string) => {
        return [
            { id: 1, label: 'At least 8 characters', met: pwd.length >= 8 },
            { id: 2, label: 'One uppercase letter', met: /[A-Z]/.test(pwd) },
            { id: 3, label: 'One lowercase letter', met: /[a-z]/.test(pwd) },
            { id: 4, label: 'One number', met: /[0-9]/.test(pwd) },
            { id: 5, label: 'One special character', met: /[^A-Za-z0-9]/.test(pwd) },
        ];
    };

    const requirements = getPasswordRequirements(password);
    const strengthScore = requirements.filter((req) => req.met).length;

    const getStrengthColor = () => {
        if (!password) return 'bg-[#E7E4DD]';
        if (strengthScore <= 2) return 'bg-red-500';
        if (strengthScore <= 4) return 'bg-amber-500';
        return 'bg-green-500';
    };

    // OTP Input Handlers
    const handleOtpChange = (index: number, value: string) => {
        setErrorMsg('');
        if (value.length > 1) {
            value = value.slice(-1);
        }
        if (value && !/^\d$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 3) {
            otpInputRefs.current[index + 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length && i < 4; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        setErrorMsg('');

        const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
        if (nextEmptyIndex !== -1) {
            otpInputRefs.current[nextEmptyIndex]?.focus();
        } else {
            otpInputRefs.current[3]?.focus();
        }
    };

    // Trigger OTP sending
    const handleSendOtp = async () => {
        if (!executeRecaptcha) {
            setErrorMsg('Security check not ready. Please try again.');
            return;
        }
        setErrorMsg('');
        setIsSending(true);
        try {
            const token = await executeRecaptcha('forgot_password');
            forgotPassword(
                { username: email, recaptcha_token: token },
                {
                    onSuccess: (response: any) => {
                        setIsSending(false);
                        if (response.data?.otp) {
                            toast.info(`Development OTP: ${response.data.otp}`);
                        }
                        setStep('OTP');
                        setResendTimer(30);
                    },
                    onError: (err: any) => {
                        setIsSending(false);
                        setErrorMsg(err?.message || 'Failed to send verification code. Please try again.');
                    },
                }
            );
        } catch (error) {
            setIsSending(false);
            console.error('Recaptcha error:', error);
            setErrorMsg('Security check failed. Please try again.');
        }
    };

    // Trigger OTP verification
    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length < 4) {
            setErrorMsg('Please enter the 4-digit code.');
            return;
        }
        setErrorMsg('');
        verifyOtp(
            {
                username: email,
                otp: otpCode,
                purpose: 'reset_password',
            },
            {
                onSuccess: (response: any) => {
                    const token = response.data?.token || response.token;
                    if (token) {
                        setResetToken(token);
                        setStep('PASSWORD');
                    } else {
                        setErrorMsg('Invalid token response from server.');
                    }
                },
                onError: (err: any) => {
                    setErrorMsg(err?.message || 'Verification failed. Please try again.');
                },
            }
        );
    };

    // Trigger Password reset
    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        // Client side validation of schema
        const schemaResult = passwordSchema.safeParse({
            password,
            confirmPassword,
        });

        if (!schemaResult.success) {
            const issue = schemaResult.error.issues[0];
            setPasswordError(issue.message);
            return;
        }

        setPasswordApi(
            {
                username: email,
                token: resetToken,
                password,
                password_confirm: confirmPassword,
            },
            {
                onSuccess: (response: any) => {
                    if (response.status_code === 200 || response.status_code === 6000) {
                        setStep('SUCCESS');
                    } else {
                        setPasswordError('Failed to reset password. Please try again.');
                    }
                },
                onError: (err: any) => {
                    if (err?.errors && Object.keys(err.errors).length > 0) {
                        const firstError = Object.values(err.errors)[0] as string[];
                        setPasswordError(firstError[0] || 'Reset failed.');
                    } else {
                        setPasswordError(err?.message || 'Reset failed. Please try again.');
                    }
                },
            }
        );
    };

    const isConfirming = isSendingOtp || isSending;
    const isVerifying = isVerifyingOtp;
    const isResetting = isSettingPassword;

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                style={{
                    willChange: 'transform, opacity',
                }}
                className="relative w-[450px] max-w-[450px] bg-white rounded-lg shadow-2xl flex flex-col border border-[#EEE7DB] overflow-hidden"
            >
                {/* Step 1: Confirm Send OTP */}
                {step === 'CONFIRM' && (
                    <div className="p-8 flex flex-col">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-[#191919]">Update Password</h2>
                            <p className="text-sm text-[#474747] leading-relaxed mt-2 font-normal">
                                We will send a 4-digit verification code to your registered email{' '}
                                <strong className="text-[#191919]">{email}</strong> to verify your identity. Click confirm to proceed.
                            </p>
                        </div>

                        {errorMsg && (
                            <p className="text-sm text-red-500 mb-4 font-medium">{errorMsg}</p>
                        )}

                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isConfirming}
                                className="min-w-[110px] h-[48px] rounded-[12px] border border-[#D9D1C6] text-sm font-semibold text-[#4E3325] hover:bg-black/5 outline-none transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <GoldenButton
                                type="button"
                                onClick={handleSendOtp}
                                isLoading={isConfirming}
                                className="min-w-[110px]"
                            >
                                Confirm
                            </GoldenButton>
                        </div>
                    </div>
                )}

                {/* Step 2: Verification Code */}
                {step === 'OTP' && (
                    <form onSubmit={handleVerifyOtp} className="p-8 flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-[#191919]">Verify OTP</h2>
                            <p className="text-sm text-[#474747] leading-relaxed mt-1 font-normal">
                                Enter the 4-digit OTP received on your email.
                            </p>
                        </div>

                        {errorMsg && (
                            <p className="text-sm text-red-500 mb-4 font-medium text-center">{errorMsg}</p>
                        )}

                        <div className="flex justify-between gap-2 max-w-[320px] mx-auto w-full mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        otpInputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={index === 0 ? handleOtpPaste : undefined}
                                    className={`w-[60px] h-[60px] text-center placeholder:text-[#D5D7DA] placeholder:text-[24px] text-xl font-semibold text-[#4E3325] border ${
                                        errorMsg ? 'border-red-500 focus:border-red-600' : 'border-[#E7E4DD] focus:border-[#C4994A]'
                                    } rounded-lg bg-white outline-none transition-colors`}
                                    autoComplete="one-time-code"
                                />
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-sm mb-6">
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={resendTimer > 0 || isSendingOtp}
                                className={`font-medium transition-colors ml-auto ${
                                    resendTimer > 0 || isSendingOtp
                                        ? 'text-[#B7AFA5] cursor-not-allowed'
                                        : 'text-[#C4994A] hover:text-[#B38840] cursor-pointer'
                                }`}
                            >
                                {isSendingOtp
                                    ? 'Resending...'
                                    : resendTimer > 0
                                      ? `Resend in ${resendTimer}s`
                                      : 'Resend code'}
                            </button>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setStep('CONFIRM')}
                                disabled={isVerifying}
                                className="min-w-[110px] h-[48px] rounded-[12px] border border-[#D9D1C6] text-sm font-semibold text-[#4E3325] hover:bg-black/5 outline-none transition disabled:opacity-50"
                            >
                                Back
                            </button>
                            <GoldenButton
                                type="submit"
                                isLoading={isVerifying}
                                disabled={otp.join('').length < 4}
                                className="min-w-[110px]"
                            >
                                Verify
                            </GoldenButton>
                        </div>
                    </form>
                )}

                {/* Step 3: Setup Password */}
                {step === 'PASSWORD' && (
                    <form onSubmit={handleResetPassword} className="p-8 flex flex-col space-y-5">
                        <div>
                            <h2 className="text-xl font-bold text-[#191919]">Reset Password</h2>
                            <p className="text-sm text-[#474747] leading-relaxed mt-1 font-normal">
                                Enter your new password below.
                            </p>
                        </div>

                        {passwordError && (
                            <p className="text-sm text-red-500 font-medium text-center bg-red-50 border border-red-200 p-2.5 rounded-lg">
                                {passwordError}
                            </p>
                        )}

                        {/* New Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-[#404040]">
                                New Password <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPasswordState(e.target.value)}
                                    placeholder="Enter new password"
                                    className={`w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors ${
                                        passwordError ? 'border-red-500' : 'border-[#E7E4DD]'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-[#B7AFA5] hover:text-[#4E3325] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Strength Indicator */}
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-1.5 h-1 w-full">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                        key={level}
                                        className={`flex-1 rounded-full ${
                                            password && strengthScore >= level ? getStrengthColor() : 'bg-[#E7E4DD]'
                                        } transition-colors duration-300`}
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-1">
                                {requirements.map((req) => (
                                    <div key={req.id} className="flex items-center gap-1">
                                        {req.met ? (
                                            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                        ) : (
                                            <X className="w-3.5 h-3.5 text-[#B7AFA5] shrink-0" />
                                        )}
                                        <span className={`text-[10px] ${req.met ? 'text-green-600 font-medium' : 'text-[#7A7A7A]'}`}>
                                            {req.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-[#404040]">
                                Confirm Password <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPasswordState(e.target.value)}
                                    placeholder="Confirm new password"
                                    className={`w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors ${
                                        passwordError ? 'border-red-500' : 'border-[#E7E4DD]'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-[#B7AFA5] hover:text-[#4E3325] transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={() => setStep('OTP')}
                                disabled={isResetting}
                                className="min-w-[110px] h-[48px] rounded-[12px] border border-[#D9D1C6] text-sm font-semibold text-[#4E3325] hover:bg-black/5 outline-none transition disabled:opacity-50"
                            >
                                Back
                            </button>
                            <GoldenButton type="submit" isLoading={isResetting} className="min-w-[110px]">
                                Submit
                            </GoldenButton>
                        </div>
                    </form>
                )}

                {/* Step 4: Success Screen */}
                {step === 'SUCCESS' && (
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                        <h2 className="text-xl font-bold text-[#191919] mb-2">Password Updated</h2>
                        <p className="text-sm text-[#474747] mb-6 font-normal">
                            Your password has been successfully updated. Please use your new password next time you sign in.
                        </p>
                        <GoldenButton type="button" onClick={onClose} className="w-full">
                            Done
                        </GoldenButton>
                    </div>
                )}
            </div>
        </ModalWrapper>
    );
}
