'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin } from '@/queries/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { mutate: login, isPending } = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        login(
            { username, password, role: 'admin' },
            {
                onSuccess: (data) => {
                    if (data.status_code === 200) {
                        router.push('/dashboard');
                    } else {
                        setErrorMsg('Login failed. Please check your credentials.');
                    }
                },
                onError: (err: any) => {
                    setErrorMsg(err.message || 'Something went wrong. Please try again.');
                },
            }
        );
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        console.log('Google login clicked');
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
                    Welcome Back
                </h1>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                    Sign in to your account to continue
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                        {errorMsg}
                    </div>
                )}

                {/* Username Field */}
                <FormInput
                    label="Username"
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />

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
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors border-[#E7E4DD]"
                            placeholder="Enter your password"
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
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-[#C4994A] hover:text-[#B38840] transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Continue Button */}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#C4994A] hover:bg-[#B38840] text-white font-medium py-3 rounded-full"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Signing in...</span>
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>

                {/* Google Login Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-[#E7E4DD] hover:border-[#C4994A] text-[#4E3325] font-medium py-3 rounded-full transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Sign in with Google
                </button>
            </form>

            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-[#7A7A7A]">
                Don&apos;t have an account?{' '}
                <Link
                    href="/register"
                    className="text-[#C4994A] hover:text-[#B38840] font-medium transition-colors"
                >
                    Sign Up
                </Link>
            </p>
        </div>
    );
}
