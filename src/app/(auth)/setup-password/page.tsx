'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GoldenButton from '@/components/ui/GoldenButton';

export default function SetupPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

    const validateForm = () => {
        const newErrors: { password?: string; confirmPassword?: string } = {};
        
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!validateForm()) {
            return;
        }

        setIsPending(true);
        
        // TODO: Implement password setup API call
        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // On success, redirect to login or dashboard
            router.push('/login');
        } catch (error) {
            setErrorMsg('Failed to set password. Please try again.');
        } finally {
            setIsPending(false);
        }
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
                    Just a step away
                </h1>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                    Enter the following details & complete the signup.
                </p>
            </div>

            {/* Password Setup Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                        {errorMsg}
                    </div>
                )}

                {/* Password Field */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#404040]">
                        Password
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: undefined });
                            }}
                            placeholder="Create your password"
                            className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors ${
                                errors.password ? 'border-red-500' : 'border-[#E7E4DD]'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B7AFA5] hover:text-[#4E3325] transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#404040]">
                        Confirm Password
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                            }}
                            placeholder="Confirm your password"
                            className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors ${
                                errors.confirmPassword ? 'border-red-500' : 'border-[#E7E4DD]'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B7AFA5] hover:text-[#4E3325] transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Submit Button */}
                <GoldenButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Setting up..."
                    fullWidth
                    className="rounded-full py-3 mt-6"
                >
                    Submit
                </GoldenButton>
            </form>

            {/* Back to Login Link */}
            <p className="mt-8 text-center text-sm text-[#7A7A7A]">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="text-[#C4994A] hover:text-[#B38840] font-medium transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
