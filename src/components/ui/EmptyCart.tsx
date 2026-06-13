'use client';

import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

function EmptyCart() {
    const router = useRouter();

    return (
        <section className="px-6 py-14">
            <div className="mx-auto flex h-36 w-36 items-center justify-center">
                <img src="/images/user/frame.svg" alt="empty-cart" />
            </div>

            <p className=" text-center text-sm font-regular text-[#373737]">
                Sorry, you don&apos;t have any <br></br>item in the cart yet!
            </p>

            <div className="mt-5 flex justify-center">
                <button
                    type="button"
                    onClick={() => router.push('/products')}
                    className="inline-flex items-center justify-center rounded-full bg-[#4E3325] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#3e291c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4E3325]/40"
                >
                    Start shopping
                </button>
            </div>
        </section>
    );
}

export default EmptyCart;
