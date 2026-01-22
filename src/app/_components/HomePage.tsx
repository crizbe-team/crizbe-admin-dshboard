import Header from '@/components/user/Header';
import React from 'react';

export default function HomePage() {
    return (
        <div className="bg-linear-to-b from-[#FFFAEF] to-[#E3D1A5] h-screen">
            <Header />
            <div className="wrapper pt-[210px]">
                <div>
                    <h2>
                        Feel the Crunch.
                        <br />
                        Taste the Luxury.
                    </h2>
                </div>
                <p>
                    A slender, perfectly layered crunch stick crafted with real hazelnut, pistachio,
                    and almond—where texture meets indulgence in every bite.
                </p>
            </div>
        </div>
    );
}
